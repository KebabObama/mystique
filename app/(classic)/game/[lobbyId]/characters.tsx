"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { Render } from "@/lib/render";
import { Sphere } from "@react-three/drei";

export const Characters = () => {
  const instance = useGame((s) => s.instance);
  const target = useCamera((s) => s.camera.target);
  if (!instance) return null;

  return instance.characters.map((c) => {
    const coords = instance.game.positions[c.id];
    if (!coords) return null;
    const position = Render.getTileCenter([coords[0], 0.5, coords[1]]);
    if (Render.distance(position, target, "chebyshev") > 25) return null;
    return (
      <Sphere key={c.id} args={[0.4, 32, 32]} position={[position.x, position.y, position.z]}>
        <meshStandardMaterial color={"red"} />
      </Sphere>
    );
  });
};

