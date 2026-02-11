"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { Render } from "@/lib/render";
import React, { useMemo, useRef } from "react";
import { InstancedMesh, Object3D } from "three";

export const Entities = () => {
  const instance = useGame((s) => s.instance);
  const target = useCamera((s) => s.camera.target);
  const meshRef = useRef<InstancedMesh | null>(null);
  const temp = useMemo(() => new Object3D(), []);

  const entities = instance?.entities;

  React.useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !instance || !entities) {
      if (mesh) {
        mesh.count = 0;
        mesh.instanceMatrix.needsUpdate = true;
      }
      return;
    }

    const visible: typeof entities = [];
    entities.forEach((e) => {
      const position = Render.getTileCenter({ ...e.position, y: 0.5 });
      if (Render.distance(position, target, "chebyshev") <= 25) visible.push(e);
    });

    visible.forEach((e, i) => {
      const p = Render.getTileCenter({ ...e.position, y: 0.5 });
      temp.position.set(p.x, p.y, p.z);
      temp.updateMatrix();
      mesh.setMatrixAt(i, temp.matrix);
    });

    mesh.count = visible.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [instance, entities, target, temp]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.max(1, entities?.length ?? 0)]}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color={"red"} />
    </instancedMesh>
  );
};
