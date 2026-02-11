import { AddCharacter } from "@/app/(classic)/game/[lobbyId]/add-character";
import { CameraController } from "@/app/(classic)/game/[lobbyId]/camera-controller";
import { EndTurn } from "@/app/(classic)/game/[lobbyId]/end-turm";
import { Entities } from "@/app/(classic)/game/[lobbyId]/entities";
import { Floor } from "@/app/(classic)/game/[lobbyId]/floor";
import { GameProvider } from "@/app/(classic)/game/[lobbyId]/game-provider";
import { LogEffect } from "@/app/(classic)/game/[lobbyId]/log-effect";
import { Main } from "@/app/(classic)/game/[lobbyId]/main";
import { PostProcessing } from "@/app/(classic)/game/[lobbyId]/post-processing";
import { Sequence } from "@/app/(classic)/game/[lobbyId]/sequence";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  return (
    <Card className="size-full p-0">
      <GameProvider lobbyId={lobbyId}>
        <LogEffect />
        <div className="absolute top-0 left-0 z-10 flex w-full justify-between">
          <Sequence>
            <AddCharacter characters={characters}>
              <Button className="h-8">
                <Plus /> Add
              </Button>
            </AddCharacter>
          </Sequence>
          <EndTurn />
        </div>
        <Main lobbyId={lobbyId}>
          <Entities />
          <Floor />
          <PostProcessing />
          <directionalLight position={[0, 10, 0]} intensity={1} />
          <ambientLight position={[0, 10, 0]} intensity={0.1} />
          <CameraController />
        </Main>
      </GameProvider>
    </Card>
  );
};
