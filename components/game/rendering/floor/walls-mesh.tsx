"use client";

import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";

type Props = {
  walls: { x: number; z: number }[];
  onClickAction: (e: ThreeEvent<MouseEvent>) => void;
};

export const WallsMesh = ({ walls, onClickAction }: Props) => {
  const wallsRef = React.useRef<THREE.InstancedMesh>(null);
  const wallDummy = React.useMemo(() => new THREE.Object3D(), []);
  const wallTexture = useTexture("/textures/wall.jpg");

  React.useLayoutEffect(() => {
    if (wallTexture) {
      wallTexture.repeat.set(0.2, 0.75);
      wallTexture.wrapS = THREE.RepeatWrapping;
      wallTexture.wrapT = THREE.RepeatWrapping;
      wallTexture.needsUpdate = true;
    }
  }, [wallTexture]);

  React.useLayoutEffect(() => {
    const mesh = wallsRef.current;
    if (!mesh) return;

    for (let index = 0; index < walls.length; index++) {
      const wall = walls[index];
      wallDummy.position.set(wall.x + 0.5, 1, wall.z + 0.5);
      wallDummy.updateMatrix();
      mesh.setMatrixAt(index, wallDummy.matrix);
    }

    mesh.count = walls.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingBox();
    mesh.computeBoundingSphere();
  }, [walls, wallDummy]);

  return (
    <instancedMesh ref={wallsRef} args={[undefined, undefined, 1000]} onClick={onClickAction}>
      <boxGeometry args={[1, 2, 1]} scale={1.05} />
      <meshStandardMaterial map={wallTexture} />
    </instancedMesh>
  );
};
