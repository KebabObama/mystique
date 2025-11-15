"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import PixelTrail from "@/components/ui/pixel-trail";
import Link from "next/link";

export default () => {
  return (
    <main className="pointer-events-none relative h-dvh w-dvw overflow-hidden">
      <PixelTrail
        className="absolute"
        gridSize={40}
        trailSize={0.05}
        maxAge={200}
        glProps={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        interpolate={3}
        gooeyFilter={{ id: "custom-goo-filter", strength: 1 }}
      />

      <Card className="pointer-events-none absolute top-1/2 left-1/2 z-10 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform">
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
          <Link href="/dashboard">
            <Button className="pointer-events-auto w-full">
              Enter the arcane realm
            </Button>
          </Link>
        </Card.Content>
      </Card>
    </main>
  );
};
