"use client";

import { useLobby } from "@/hooks/use-lobby";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Render } from "@/types/render";
import { Outlines } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import React from "react";
import { Material } from "three";
import { Button } from "../ui/button";
import { Floor } from "./floor";

type GameProps = { children: React.ReactNode; lobbyId: string };

export const GameMain = ({ children, lobbyId }: GameProps) => {
  const lobby = useLobby((s) => s.lobbies).find((s) => s.id === lobbyId);
  const mobile = useIsMobile();

  if (mobile) {
    return (
      <section className="flex size-full flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-destructive text-2xl font-bold">Mobiles are not supported yet.</h1>
        <p className="text-lg">
          Please return to the dashboard or switch to a device with bigger resolution and ideally
          better WebGL support.
        </p>
        <p className="text-lg">Thank you for understanding :)</p>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </section>
    );
  }

  const handleTileClick: Render.TileEventCallback = (gridPos, _, tileId) => {
    console.log("Tile clicked in main game:", { gridPos, tileId });
  };

  return (
    <Canvas shadows>
      <Floor
        tileSize={1}
        width={50}
        depth={50}
        tileHeight={0.1}
        centerGrid
        onTileClick={handleTileClick}
        tileProps={{ roughness: 0.8, metalness: 0.2, castShadow: false, receiveShadow: true }}
      />
      {children}
      <mesh
        castShadow
        position={[0, 5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log(e);
        }}
      >
        <Outlines customDepthMaterial={new Material()} thickness={5} color={"red"} />
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
};

