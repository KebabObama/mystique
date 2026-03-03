"use client";

import { Plane, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";

type Props = {
  position: { x: number; y: number; z: number };
  onClick(e: ThreeEvent<MouseEvent>): void;
  onPointerMove(e: ThreeEvent<PointerEvent>): void;
};

export const FloorPlane = ({ position, onClick, onPointerMove }: Props) => {
  const floorTexture = useTexture("/textures/floor.jpg");

  useLayoutEffect(() => {
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(25, 25);
    floorTexture.needsUpdate = true;
  }, [floorTexture]);

  return (
    <Plane
      onClick={onClick}
      onPointerMove={onPointerMove}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[position.x, position.y, position.z]}
      scale={50}
    >
      <meshStandardMaterial map={floorTexture} />
    </Plane>
  );
};
