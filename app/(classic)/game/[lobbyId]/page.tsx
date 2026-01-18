import { BuilderToolbar } from "@/components/game/builder-toolbar";
import { CameraController } from "@/components/game/camera-controller";
import { GameFloor } from "@/components/game/floor";
import { GameBlocks } from "@/components/game/game-blocks";
import { GameMain } from "@/components/game/game-main";
import { PostProcessing } from "@/components/game/post-processing";
import { Statistics } from "@/components/game/statistics";
import { Card } from "@/components/ui/card";

export default async ({ params }: { params: Promise<{ lobbyId: string }> }) => {
  const { lobbyId } = await params;
  return (
    <Card className="h-full p-0">
      <GameMain lobbyId={lobbyId}>
        <PostProcessing />
        <GameFloor />
        <Statistics />
        <directionalLight position={[0, 10, 0]} intensity={1} />
        <ambientLight position={[0, 10, 0]} intensity={0.1} />
        <CameraController />
        <GameBlocks />
      </GameMain>
      <BuilderToolbar />
    </Card>
  );
};
