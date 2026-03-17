"use client";

import { useCamera } from "@/hooks/use-camera";
import { Render } from "@/lib/render";
import React from "react";

/** Represents the floor position type. */
export type FloorPosition = {
  position: { x: number; y: number; z: number };
  isWithinRenderDistance: (point: { x: number; z: number }) => boolean;
};

const RENDER_DISTANCE = 25;

/** Defines the use floor position constant. */
export const useFloorPosition = (): FloorPosition => {
  const target = useCamera((s) => s.camera.target);
  const position = Render.getTilePosition(target);

  const isWithinRenderDistance = React.useCallback(
    (point: { x: number; z: number }) =>
      Render.distance(position, point, "chebyshev") <= RENDER_DISTANCE,
    [position]
  );

  return { position, isWithinRenderDistance };
};
