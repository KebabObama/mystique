"use client";

import { Game } from "@/lib/game";
import { useGame } from "@/lib/hooks/use-game";
import React from "react";
import { FloorClickHandler } from "./floor/floor-click-handler";
import { FloorGrid } from "./floor/floor-grid";
import { FloorSurface } from "./floor/floor-surface";
import { FloorTilesRenderer } from "./floor/floor-tiles-renderer";
import { useFloorPosition } from "./floor/use-floor-position";
import { useFloorTiles } from "./floor/use-floor-tiles";
import { WallClickHandler } from "./floor/wall-click-handler";

const EMPTY_WALLS: any[] = [];

export const Floor = React.memo(() => {
  const { position, isWithinRenderDistance } = useFloorPosition();
  const walls = useGame((s) => s.instance?.data.walls ?? EMPTY_WALLS);

  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const current = useGame((s) => s.sequence.current);
  const moveTo = useGame((s) => s.movement.moveTo);

  const [hoverPos, setHoverPos] = React.useState<{ x: number; z: number } | null>(null);

  // Determine ability mode and wall area start
  const abilityMode = mode.type === "ability" ? mode : undefined;
  const ability = abilityMode?.ability;
  const selectedAbilityTarget = abilityMode?.target;
  const wallAreaStart =
    mode.type === "wall:place-area" || mode.type === "wall:destroy-area" ? mode.start : undefined;

  const actions =
    current?.actions ??
    (current && (current.type === "character" || current?.type === "monster")
      ? current.playable.maxActions
      : 0) ??
    0;

  // Calculate all tiles
  const tiles = useFloorTiles({
    floorPosition: { position, isWithinRenderDistance },
    current,
    ability,
    selectedAbilityTarget,
    wallAreaStart,
    hoverPos,
  });

  // Filter visible walls
  const visibleWalls = React.useMemo(
    () => walls.filter((wall) => isWithinRenderDistance(wall)),
    [walls, isWithinRenderDistance]
  );

  return (
    <>
      {/* Click handlers */}
      <FloorClickHandler viableAbility={tiles.viableAbility} />
      <WallClickHandler visibleWalls={visibleWalls} />

      {/* Rendered surfaces */}
      <FloorSurface position={position} walls={visibleWalls} onHoverPosChange={setHoverPos} />

      {/* Tile overlays */}
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

      {/* Grid */}
      <FloorGrid position={position} />
    </>
  );
});
