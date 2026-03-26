import {
  AbilitiesDrawer,
  ActionsDisplay,
  CameraController,
  CampfireControls,
  CampfireRestDialog,
  CampfireShopDialog,
  ChestControls,
  EndTurn,
  Entities,
  EntityContextMenu,
  EntityHoverCard,
  Floor,
  GameProvider,
  LevelUpDialog,
  Main,
  MonsterControls,
  MoveButton,
  PostProcessing,
  Sequence,
  TradingDialog,
  WallControls,
} from "@/components/game";
import { InventoryButton, InventoryPanel } from "@/components/inventory";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** Renders the game lobbyId page. */
export default async ({ params }: { params: Promise<{ lobbyId: string }> }) => {
  const { lobbyId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  const data = await db.query.lobby.findFirst({
    where: eq(schema.lobby.id, lobbyId),
    with: { members: true },
  });

  const isMember = data?.members.some((e) => e.userId === session.user.id);
  if (!data || !isMember) redirect("/dashboard");

  const characters = await db.query.character.findMany({
    where: eq(schema.character.ownerId, session.user.id),
  });

  const items = await db.query.item.findMany({ columns: { id: true, name: true } });

  const monsters = await db.query.monster.findMany();

  return (
    <Card className="size-full p-0">
      <GameProvider lobbyId={lobbyId}>
        <EntityContextMenu />
        <EntityHoverCard />
        <CampfireRestDialog />
        <CampfireShopDialog />
        <TradingDialog />
        <LevelUpDialog />
        <InventoryPanel items={items} />
        <div className="absolute top-0 left-0 z-10 flex w-full justify-between">
          <Sequence characters={characters} />
          <EndTurn />
        </div>
        <div className="absolute bottom-0 left-0 z-10 flex w-full items-end justify-between gap-1.5">
          <ActionsDisplay />
          <div className="flex min-w-2xs flex-col gap-1.5">
            <WallControls />
            <MoveButton />
            <AbilitiesDrawer />
            <ChestControls />
            <CampfireControls />
            <MonsterControls monsters={monsters} />
            <InventoryButton />
          </div>
        </div>
        <Main lobbyId={lobbyId}>
          <Entities />
          <Floor />
          <PostProcessing />
          <CameraController />
        </Main>
      </GameProvider>
    </Card>
  );
};
