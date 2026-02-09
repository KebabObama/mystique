"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { Render } from "@/lib/render";
import { Plane } from "@react-three/drei";
import React from "react";

export const Floor = React.memo(() => {
  const target = useCamera((s) => s.camera.target);
  const userId = useUser((s) => s?.id);
  const instance = useGame((s) => s.instance);

  const position = Render.getTilePosition(target);
  const isMaster = userId === instance?.id;
  const isOnTurn = isMaster ? instance?.turn === -1 : false;

  const handle = () => {
    if (!isOnTurn) return;
    if (isMaster) {
    } else {
    }
  };

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
});

