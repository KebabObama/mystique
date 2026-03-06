"use client";

import { Game } from "@/types";
import { Plane } from "@react-three/drei";

type Props = {
  active: boolean;
  tiles: { x: number; z: number }[];
  selectedTarget?: { x: number; z: number };
  current: Game.Entity | undefined;
  actions: number;
  y: number;
  onSelectAction: (position: { x: number; z: number }) => void;
  onCancelAction: () => void;
  center: { x: number; y: number; z: number };
};

export const AbilityTiles = ({
  active,
  tiles,
  selectedTarget,
  current,
  actions,
  y,
  onSelectAction,
  onCancelAction,
  center,
}: Props) => {
  if (!active) return null;

  return (
    <>
      {tiles.map((pos) => (
        <Plane
          key={`ability-${pos.x}-${pos.z}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!current || actions <= 0) return;
            onSelectAction(pos);
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[pos.x + 0.5, y + 0.015, pos.z + 0.5]}
          scale={0.9}
        >
          <meshBasicMaterial
            color="orange"
            transparent
            opacity={selectedTarget?.x === pos.x && selectedTarget?.z === pos.z ? 0.7 : 0.35}
          />
        </Plane>
      ))}

      <Plane
        onClick={onCancelAction}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[center.x, center.y + 0.001, center.z]}
        scale={60}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>
    </>
  );
};
