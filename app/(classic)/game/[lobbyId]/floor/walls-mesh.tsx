"use client";

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
  }, [walls, wallDummy]);

  return (
    <instancedMesh ref={wallsRef} args={[undefined, undefined, 1000]} onClick={onClickAction}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#6b7280" />
    </instancedMesh>
  );
};
