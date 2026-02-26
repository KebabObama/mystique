"use client";

import { Game } from "@/lib/game";
import { Plane } from "@react-three/drei";

type Props = {
  tiles: { x: number; z: number }[];
  current: Game.Entity | undefined;
  actions: number;
  y: number;
  onMoveAction: (entityId: string, position: { x: number; z: number }) => void;
  onEndModeAction: () => void;
};

export const MoveTiles = ({ tiles, current, actions, y, onMoveAction, onEndModeAction }: Props) => {
  return (
    <>
      {tiles.map((pos, i) => (
        <Plane
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            if (!current || actions <= 0) return;
            onMoveAction(current.id, pos);
            onEndModeAction();
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[pos.x + 0.5, y + 0.01, pos.z + 0.5]}
          scale={0.9}
        >
          <meshBasicMaterial color="green" transparent opacity={0.5} />
        </Plane>
      ))}
    </>
  );
};

