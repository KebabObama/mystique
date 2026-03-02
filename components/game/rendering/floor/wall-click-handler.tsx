"use client";

import { useFloorClick } from "@/lib/hooks/use-floor-click";
import { useGame } from "@/lib/hooks/use-game";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

type Props = { visibleWalls: Array<{ x: number; z: number }> };

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
          // Use the calculated point directly - always accurate
          addWallAt(point);
          break;
        case "wall:destroy":
          if (instanceId !== undefined && visibleWalls[instanceId]) {
            deleteWallAt(visibleWalls[instanceId]);
          } else deleteWallAt(point);
          break;
        default:
          // Forward to floor click callbacks
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
