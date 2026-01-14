"use client";

import { useBuilder } from "@/hooks/use-builder";
import type { ThreeEvent } from "@react-three/fiber";
import React from "react";

export const GameBlocks = React.memo(() => {
  const blocks = useBuilder((s) => s.blocks);
  const buildAction = useBuilder((s) => s.buildAction);
  const onSceneClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!e.face) return;
      e.stopPropagation();
      buildAction(e.point, e.face?.normal);
    },
    [buildAction]
  );

  return (
    <>
      {blocks.map((block) => (
        <mesh frustumCulled={true} key={block.id} position={block.position} onClick={onSceneClick}>
          <boxGeometry />
          <meshStandardMaterial color={block.color} />
        </mesh>
      ))}
    </>
  );
});

