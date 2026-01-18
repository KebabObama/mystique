"use client";

import { useBuilder, type Block } from "@/hooks/use-builder";
import { Outlines } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const tempObject = new THREE.Object3D();
const MAX_INSTANCES = 8000;

export const GameBlocks = React.memo(() => {
  const blocks = useBuilder((s) => s.blocks);
  const buildAction = useBuilder((s) => s.buildAction);

  const blocksByColor = useMemo(() => {
    const groups: Record<string, Block[]> = {};
    for (const block of blocks) {
      if (!groups[block.color]) groups[block.color] = [];
      groups[block.color].push(block);
    }
    return groups;
  }, [blocks]);

  const onSceneClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (!e.face) return;
      buildAction(e.point, e.face.normal);
    },
    [buildAction]
  );

  return (
    <>
      {Object.entries(blocksByColor).map(([color, groupedBlocks]) => (
        <InstancedBlockGroup
          key={color}
          color={color}
          blocks={groupedBlocks}
          onClick={onSceneClick}
        />
      ))}
    </>
  );
});

const InstancedBlockGroup = React.memo(({ color, blocks, onClick }: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    if (!geo.boundingBox) geo.computeBoundingBox();
    geo.boundingBox?.set(
      new THREE.Vector3(-1000, -1000, -1000),
      new THREE.Vector3(1000, 1000, 1000)
    );
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1000);
    blocks.forEach((block: Block, i: number) => {
      tempObject.position.set(block.position[0], block.position[1], block.position[2]);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    });
    for (let i = blocks.length; i < MAX_INSTANCES; i++) {
      tempObject.position.set(0, -9999, 0);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.count = blocks.length;
  }, [blocks]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null as any, null as any, MAX_INSTANCES]}
      onClick={onClick}
      frustumCulled={false}
    >
      <Outlines thickness={1} color={"white"} />
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </instancedMesh>
  );
});

