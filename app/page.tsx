import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PixelTrail from "@/components/ui/pixel-trail";
import Link from "next/link";

export default function Home() {
  return (
    <main className="pointer-events-none relative h-dvh w-dvw overflow-hidden">
      <PixelTrail
        className="absolute"
        glProps={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
        gooeyFilter={{ id: "custom-goo-filter", strength: 1 }}
        gridSize={40}
        interpolate={3}
        maxAge={200}
        trailSize={0.05}
      />
      <Card className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col gap-6 p-6 text-center">
        <h1 className="text-2xl font-extrabold">Mystique</h1>
        <p className="text-lg">
          Multiplayer online Dungeons and Dragons game simulating 1st edition gameplay
        </p>
        <Link href="/dashboard">
          <Button className="pointer-events-auto w-full">Begin your story</Button>
        </Link>
      </Card>
    </main>
  );
}
