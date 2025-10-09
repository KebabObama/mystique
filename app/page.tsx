import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import PixelTrail from "@/components/ui/hover-background";

export default function Home() {
  return (
    <main className="relative h-dvh w-dvw overflow-hidden">
      <div className="absolute h-full w-full">
        <PixelTrail
          gridSize={50}
          trailSize={0.03}
          maxAge={250}
          interpolate={4}
          color="#fff"
          gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
        />
      </div>

      <div className="relative flex h-dvh w-dvw flex-col items-center justify-start gap-10 overflow-auto p-4 md:justify-center">
        <Card className="sticky z-10 min-w-full sm:min-w-sm md:min-w-2xl">
          <Card.Header>
            <Card.Title className="text-center text-2xl font-bold">
              Mystique
            </Card.Title>
            <Card.Description className="text-center">
              Multiplayer online Dungeons and Dragons game simulating 1st
              edition gameplay
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Button className="w-full">
              <a href="/dashboard" className="w-full">
                Enter the arcane realm
              </a>
            </Button>
          </Card.Content>
        </Card>
        <Card className="z-10 min-w-full sm:min-w-sm md:min-w-2xl">
          <Card.Content>aaaaaaaaaaaa</Card.Content>
        </Card>
        <Card className="z-10 min-w-full sm:min-w-sm md:min-w-2xl">
          <Card.Content>aaaaaaaaaaaa</Card.Content>
        </Card>
        <Card className="z-10 min-w-full sm:min-w-sm md:min-w-2xl">
          <Card.Content>aaaaaaaaaaaa</Card.Content>
        </Card>
      </div>
    </main>
  );
}
