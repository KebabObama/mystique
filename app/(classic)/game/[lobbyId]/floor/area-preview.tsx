"use client";

import { Plane } from "@react-three/drei";

type Props = { tiles: { x: number; z: number }[]; y: number; isDestroy: boolean };

export const AreaPreview = ({ tiles, y, isDestroy }: Props) => {
  if (tiles.length === 0) return null;

  return (
    <>
      {tiles.map((pos, i) => (
        <Plane
          key={`area-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[pos.x + 0.5, y + 0.02, pos.z + 0.5]}
          scale={0.9}
        >
          <meshBasicMaterial color={isDestroy ? "red" : "cyan"} transparent opacity={0.4} />
        </Plane>
      ))}
    </>
  );
};

