"use client";

import { useFloorClick } from "@/hooks/use-floor-click";
import { useGame } from "@/hooks/use-game";
import { Render } from "@/lib/render";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";
import { FloorPlane } from "./floor-plane";
import { WallsMesh } from "./walls-mesh";

type Props = {
  position: { x: number; y: number; z: number };
  walls: Array<{ x: number; z: number }>;
  onHoverPosChange?: (pos: { x: number; z: number } | null) => void;
};

/** Renders the floor surface component. */
export const FloorSurface = ({ position, walls, onHoverPosChange }: Props) => {
  const mode = useGame((s) => s.mode);
  const emitFloorClick = useFloorClick((s) => s.emitFloorClick);
  const emitWallClick = useFloorClick((s) => s.emitWallClick);

  const handleFloorMove = React.useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (mode.type === "wall:place-area" || mode.type === "wall:destroy-area") {
        const point = Render.getTilePosition(e.point);
        onHoverPosChange?.({ x: point.x, z: point.z });
      }
    },
    [mode, onHoverPosChange]
  );

  const handleFloorClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      const point = Render.getTilePosition(e.point);
      emitFloorClick(e, point);
    },
    [emitFloorClick]
  );

  const handleWallClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const point = Render.getTilePosition(e.point);
      emitWallClick(e, point, e.instanceId);
    },
    [emitWallClick]
  );

  return (
    <>
      <FloorPlane position={position} onClick={handleFloorClick} onPointerMove={handleFloorMove} />
      <WallsMesh walls={walls} onClickAction={handleWallClick} />
    </>
  );
};
