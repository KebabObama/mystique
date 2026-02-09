"use client";

import { useCamera } from "@/hooks/use-camera";
import { Render } from "@/lib/render";
import { Plane } from "@react-three/drei";

export const Floor = () => {
  const target = useCamera((s) => s.camera.target);
  const position = Render.getTilePosition(target);

  return (
    <>
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position.x, position.y, position.z]}
        scale={50}
      />
      <gridHelper args={[50, 50, "#444444"]} position={[position.x, position.y, position.z]} />
    </>
  );
};

