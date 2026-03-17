import { CampfireControls } from "@/components/game/controls/campfire-controls";
import { ChestControls } from "@/components/game/controls/chest-controls";
import { EndTurn } from "@/components/game/controls/end-turm";
import { MonsterControls } from "@/components/game/controls/monster-controls";
import { MoveButton } from "@/components/game/controls/move-button";
import { WallControls } from "@/components/game/controls/wall-controls";
import { GameProvider } from "@/components/game/core/game-provider";
import { Main } from "@/components/game/core/main";
import { Sequence } from "@/components/game/core/sequence";
import { CameraController } from "@/components/game/rendering/camera-controller";
import { Entities } from "@/components/game/rendering/entities";
import { Floor } from "@/components/game/rendering/floor";
import { PostProcessing } from "@/components/game/rendering/post-processing";
import { AbilitiesDrawer } from "@/components/game/ui/abilities-drawer";
import { ActionsDisplay } from "@/components/game/ui/actions-display";
import { AddCharacter } from "@/components/game/ui/add-character";
import { CampfireRestDialog } from "@/components/game/ui/campfire-rest-dialog";
import { CampfireShopDialog } from "@/components/game/ui/campfire-shop-dialog";
import { EntityContextMenu } from "@/components/game/ui/entity-context-menu";
import { EntityHoverCard } from "@/components/game/ui/entity-hover-card";
import { LevelUpDialog } from "@/components/game/ui/level-up-dialog";
import { LogEffect } from "@/components/game/ui/log-effect";
import { TradingDialog } from "@/components/game/ui/trading-dialog";
import { InventoryButton } from "@/components/inventory/inventory-button";
import { InventoryPanel } from "@/components/inventory/inventory-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";
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
    columns: { id: true, name: true, race: true, level: true, lobbyId: true },
  });

  const items = await db.query.item.findMany({ columns: { id: true, name: true } });

  const monsters = await db.query.monster.findMany();

  return (
    <Card className="size-full p-0">
      <GameProvider lobbyId={lobbyId}>
        <LogEffect />
        <EntityContextMenu />
        <EntityHoverCard />
        <CampfireRestDialog />
        <CampfireShopDialog />
        <TradingDialog />
        <LevelUpDialog />
        <InventoryPanel items={items} />
        <div className="absolute top-0 left-0 z-10 flex w-full justify-between">
          <Sequence>
            <AddCharacter characters={characters}>
              <Button size="sm" className="h-8">
                <Plus /> Add
              </Button>
            </AddCharacter>
          </Sequence>
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
          <directionalLight position={[0, 10, 0]} intensity={0.9} />
          <directionalLight position={[12, 6, 0]} intensity={0.45} />
          <directionalLight position={[-12, 6, 0]} intensity={0.45} />
          <ambientLight position={[0, 10, 0]} intensity={0.25} />
          <CameraController />
        </Main>
      </GameProvider>
    </Card>
  );
};
