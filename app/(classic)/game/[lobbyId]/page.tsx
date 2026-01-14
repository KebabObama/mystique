import { BuilderToolbar } from "@/components/game/builder-toolbar";
import { CameraController } from "@/components/game/camera-controller";
import { GameMain } from "@/components/game/game-main";
import { PostProcessing } from "@/components/game/post-processing";
import { Statistics } from "@/components/game/statistics";
import { Card } from "@/components/ui/card";

export default async ({ params }: { params: Promise<{ lobbyId: string }> }) => {
  const { lobbyId } = await params;
  return (
    <Card className="h-full p-0">
      <GameMain lobbyId={lobbyId}>
        <gridHelper args={[30, 30, "#ff0000", "#444444"]} position={[0, 0.01, 0]} />
        <PostProcessing />
        <Statistics />
        <directionalLight position={[0, 10, 0]} intensity={1} />
        <CameraController />
      </GameMain>
      <BuilderToolbar />
    </Card>
  );
};
