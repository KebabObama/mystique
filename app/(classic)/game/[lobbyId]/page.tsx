import { CameraController } from "@/components/game/camera-controller";
import { GameMain } from "@/components/game/game-main";
import { Card } from "@/components/ui/card";

export default async ({ params }: { params: Promise<{ lobbyId: string }> }) => {
  const { lobbyId } = await params;
  return (
    <Card className="h-full p-0">
      <GameMain lobbyId={lobbyId}>
        <directionalLight castShadow position={[0, 10, 0]} intensity={1} />
        <CameraController />
      </GameMain>
    </Card>
  );
};
