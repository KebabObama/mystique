"use client";

import { useBuilder } from "@/hooks/use-builder"; // Updated hook
import { useIsMobile } from "@/hooks/use-mobile";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

type GameProps = { children: React.ReactNode; lobbyId: string };

export const GameMain = ({ children, lobbyId }: GameProps) => {
  const mobile = useIsMobile();
  const firstPoint = useBuilder((s) => s.firstPoint);
  const moveSource = useBuilder((s) => s.moveSource);

  if (mobile) {
    return (
      <section className="flex size-full flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-destructive text-2xl font-bold">Mobiles are not supported yet.</h1>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </section>
    );
  }

  return (
    <Canvas camera={{ position: [10, 10, 10] }}>
      {(firstPoint || moveSource) && (
        <mesh
          position={[
            (firstPoint?.[0] ?? moveSource![0]) + 0.5,
            (firstPoint?.[1] ?? moveSource![1]) + 0.5,
            (firstPoint?.[2] ?? moveSource![2]) + 0.5,
          ]}
        >
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial
            color={moveSource ? "blue" : "lime"}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
      {children}
    </Canvas>
  );
};

