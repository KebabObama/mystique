"use client";

import { useBuilder } from "@/hooks/use-builder";
import { Plane } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";

export const GameFloor = () => {
  const buildAction = useBuilder((s) => s.buildAction);

  const onSceneClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    buildAction(e.point, e.face?.normal!);
  };

  return (
    <>
      <Plane
        onClick={onSceneClick}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        scale={50}
      />
      <gridHelper args={[50, 50, "#ff0000", "#444444"]} position={[0, 0.002, 0]} />
    </>
  );
};

