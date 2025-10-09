"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import PixelTrail from "@/components/ui/pixel-trail";

export default function () {
  return (
    <main className="relative h-dvh w-dvw overflow-hidden">
      <PixelTrail
        className="absolute"
        gridSize={50}
        trailSize={0.025}
        maxAge={200}
        interpolate={5}
        color="#fff"
        gooeyFilter={{ id: "custom-goo-filter", strength: 1 }}
      />

      <Card className="pointer-events-auto absolute top-1/2 left-1/2 -z-10 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform">
        <Card.Header>
          <Card.Title className="text-center text-2xl font-bold">
            Mystique
          </Card.Title>
          <Card.Description className="text-center">
            Multiplayer online Dungeons and Dragons game simulating 1st edition
            gameplay
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Button className="w-full">
            <a href="/dashboard">Enter the arcane realm</a>
          </Button>
        </Card.Content>
      </Card>
    </main>
  );
}
