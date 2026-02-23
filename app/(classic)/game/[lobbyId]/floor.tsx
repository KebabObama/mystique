"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { Render } from "@/lib/render";
import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

export const Floor = React.memo(() => {
  const target = useCamera((s) => s.camera.target);
  const moveMode = useGame((s) => s.actions.moveMode);
  const setMoveMode = useGame((s) => s.actions.setMoveMode);
  const current = useGame((s) => s.sequence.current);
  const moveTo = useGame((s) => s.movement.moveTo);
  const actions = current?.actions ?? current?.playable.maxActions ?? 0;

  const position = Render.getTilePosition(target);

  const handle = (e: ThreeEvent<MouseEvent>) => {
    const point = Render.getTilePosition(e.point);
    console.log(point);
  };

  const viable = React.useMemo(() => {
    if (!current) return [];
    return useGame.getState().movement.getViable(current.id);
  }, [current]);

  const handleMoveTile = (pos: { x: number; z: number }) => {};

  return (
    <>
      <Plane
        onClick={handle}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position.x, position.y, position.z]}
        scale={50}
      />
      {moveMode &&
        viable.map((pos, i) => (
          <Plane
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (current && actions > 0) {
                moveTo(current.id, pos);
                setMoveMode(false);
              }
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[pos.x + 0.5, position.y + 0.01, pos.z + 0.5]}
            scale={0.9}
          >
            <meshBasicMaterial color="green" transparent opacity={0.5} />
          </Plane>
        ))}
      <gridHelper args={[50, 50, "#444444"]} position={[position.x, position.y, position.z]} />
    </>
  );
});
