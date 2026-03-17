"use client";

import { useGame } from "@/hooks/use-game";
import { Game } from "@/lib/game";
import React from "react";
import { FloorClickHandler } from "./floor/floor-click-handler";
import { FloorGrid } from "./floor/floor-grid";
import { FloorSurface } from "./floor/floor-surface";
import { FloorTilesRenderer } from "./floor/floor-tiles-renderer";
import { useFloorPosition } from "./floor/use-floor-position";
import { useFloorTiles } from "./floor/use-floor-tiles";
import { WallClickHandler } from "./floor/wall-click-handler";

const EMPTY_WALLS: any[] = [];

/** Renders the floor component. */
export const Floor = React.memo(() => {
  const { position, isWithinRenderDistance } = useFloorPosition();
  const walls = useGame((s) => s.instance?.data.walls ?? EMPTY_WALLS);

  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const current = useGame((s) => s.sequence.current);
  const moveTo = useGame((s) => s.entity.moveTo);

  const [hoverPos, setHoverPos] = React.useState<{ x: number; z: number } | null>(null);

  const abilityMode = mode.type === "ability" ? mode : undefined;
  const ability = abilityMode?.ability;
  const selectedAbilityTarget = abilityMode?.target;
  const wallAreaStart =
    mode.type === "wall:place-area" || mode.type === "wall:destroy-area" ? mode.start : undefined;

  const actions =
    current?.actions ??
    (current && (current.type === "character" || current?.type === "monster")
      ? current.maxActions
      : 0) ??
    0;

  const tiles = useFloorTiles({
    floorPosition: { position, isWithinRenderDistance },
    current,
    ability,
    selectedAbilityTarget,
    wallAreaStart,
    hoverPos,
  });

  const visibleWalls = React.useMemo(
    () => walls.filter((wall) => isWithinRenderDistance(wall)),
    [walls, isWithinRenderDistance]
  );

  return (
    <>
      <FloorClickHandler viableAbility={tiles.viableAbility} />
      <WallClickHandler visibleWalls={visibleWalls} />

      <FloorSurface position={position} walls={visibleWalls} onHoverPosChange={setHoverPos} />

      <FloorTilesRenderer
        mode={mode}
        setModeAction={setMode}
        current={current as Game.Entity | undefined}
        moveToAction={moveTo}
        actions={actions}
        tiles={tiles}
        floorPositionY={position.y}
        floorCenter={position}
      />

      <FloorGrid position={position} />
    </>
  );
});
