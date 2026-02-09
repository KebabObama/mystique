"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { Render } from "@/lib/render";
import { useEffect, useMemo, useRef } from "react";
import { InstancedMesh, Object3D } from "three";

export const Characters = () => {
  const instance = useGame((s) => s.instance);
  const target = useCamera((s) => s.camera.target);
  const meshRef = useRef<InstancedMesh | null>(null);
  const temp = useMemo(() => new Object3D(), []);

  const chars = instance?.characters ?? [];

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !instance) {
      if (mesh) {
        mesh.count = 0;
        mesh.instanceMatrix.needsUpdate = true;
      }
      return;
    }

    const visible: typeof chars = [];
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const coords = instance.game.positions[c.id];
      if (!coords) continue;
      const position = Render.getTileCenter([coords[0], 0.5, coords[1]]);
      if (Render.distance(position, target, "chebyshev") <= 25) visible.push(c);
    }

    visible.forEach((c, i) => {
      const coords = instance.game.positions[c.id];
      if (!coords) return;
      const p = Render.getTileCenter([coords[0], 0.5, coords[1]]);
      temp.position.set(p.x, p.y, p.z);
      temp.updateMatrix();
      mesh.setMatrixAt(i, temp.matrix);
    });

    mesh.count = visible.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [instance, chars, target, temp]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.max(1, chars.length)]}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color={"red"} />
    </instancedMesh>
  );
};
