"use client";

import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";

type Props = {
  position: { x: number; y: number; z: number };
  onClick(e: ThreeEvent<MouseEvent>): void;
  onPointerMove(e: ThreeEvent<PointerEvent>): void;
};

export const FloorPlane = ({ position, onClick, onPointerMove }: Props) => {
  return (
    <Plane
      onClick={onClick}
      onPointerMove={onPointerMove}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[position.x, position.y, position.z]}
      scale={50}
    />
  );
};
