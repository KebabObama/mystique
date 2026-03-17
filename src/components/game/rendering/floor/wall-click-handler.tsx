"use client";

import { useFloorClick } from "@/hooks/use-floor-click";
import { useGame } from "@/hooks/use-game";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

type Props = { visibleWalls: Array<{ x: number; z: number }> };

/** Renders the wall click handler component. */
export const WallClickHandler = ({ visibleWalls }: Props) => {
  const mode = useGame((s) => s.mode);
  const addWallAt = useGame((s) => s.wall.addAt);
  const deleteWallAt = useGame((s) => s.wall.deleteAt);

  const emitFloorClick = useFloorClick((s) => s.emitFloorClick);

  React.useEffect(() => {
    const handleWallClick = (
      e: ThreeEvent<MouseEvent>,
      point: { x: number; z: number },
      instanceId?: number
    ) => {
      switch (mode.type) {
        case "wall:place":
          if (instanceId === undefined || !visibleWalls[instanceId]) {
            emitFloorClick(e, point);
            break;
          }
          const wall = visibleWalls[instanceId];
          const normal = e.face?.normal;
          if (normal) {
            const absX = Math.abs(normal.x);
            const absZ = Math.abs(normal.z);
            let newPos = { x: wall.x, z: wall.z };
            if (absX > absZ) newPos.x = wall.x + Math.sign(normal.x);
            else newPos.z = wall.z + Math.sign(normal.z);
            addWallAt(newPos);
          }
          break;
        case "wall:destroy":
          if (instanceId !== undefined && visibleWalls[instanceId]) {
            deleteWallAt(visibleWalls[instanceId]);
          } else deleteWallAt(point);
          break;
        default:
          emitFloorClick(e, point);
          break;
      }
    };

    const addWallClickCallback = useFloorClick.getState().addWallClickCallback;
    const removeWallClickCallback = useFloorClick.getState().removeWallClickCallback;

    addWallClickCallback(handleWallClick);

    return () => {
      removeWallClickCallback(handleWallClick);
    };
  }, [mode, addWallAt, deleteWallAt, visibleWalls, emitFloorClick]);

  return null;
};
