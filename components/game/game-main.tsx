"use client";

import { useBuilder } from "@/hooks/use-builder"; // Updated hook
import { useLobby } from "@/hooks/use-lobby";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlines, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

type GameProps = { children: React.ReactNode; lobbyId: string };

export const GameMain = ({ children, lobbyId }: GameProps) => {
  const lobby = useLobby((s) => s.lobbies).find((s) => s.id === lobbyId);
  const mobile = useIsMobile();
  const { blocks, buildAction, firstPoint, moveSource, tool } = useBuilder();

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

  const onSceneClick = (e: any) => {
    e.stopPropagation();
    buildAction(e.point, e.face.normal);
  };

  return (
    <Canvas camera={{ position: [10, 10, 10] }}>
      <pointLight position={[10, 10, 10]} />

      <Plane
        onClick={onSceneClick}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        scale={30}
      />

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

      {blocks.map((block) => (
        <mesh key={block.id} position={block.position} onClick={onSceneClick}>
          <Outlines thickness={5} color={"white"} />
          <boxGeometry />
          <meshStandardMaterial color={block.color} />
        </mesh>
      ))}

      {children}
    </Canvas>
  );
};

