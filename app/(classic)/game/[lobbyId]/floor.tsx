"use client";

import { useCamera } from "@/hooks/use-camera";
import { Render } from "@/lib/render";
import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

export const Floor = React.memo(() => {
  const target = useCamera((s) => s.camera.target);

  const position = Render.getTilePosition(target);

  const handle = (e: ThreeEvent<MouseEvent>) => {
    const point = Render.getTilePosition(e.point);
    console.log(point);
  };

  return (
    <>
      <Plane
        onClick={handle}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position.x, position.y, position.z]}
        scale={50}
      />
      <gridHelper args={[50, 50, "#444444"]} position={[position.x, position.y, position.z]} />
    </>
  );
});
