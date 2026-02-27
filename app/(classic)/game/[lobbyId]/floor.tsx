"use client";

import { Game } from "@/lib/game";
import { useCamera } from "@/lib/hooks/use-camera";
import { useGame } from "@/lib/hooks/use-game";
import { Render } from "@/lib/render";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";
import { AbilityTiles } from "./floor/ability-tiles";
import { AreaPreview } from "./floor/area-preview";
import { FloorPlane } from "./floor/floor-plane";
import { MoveTiles } from "./floor/move-tiles";
import { WallsMesh } from "./floor/walls-mesh";

const EMPTY_WALLS: any[] = [];
const RENDER_DISTANCE = 25;

export const Floor = React.memo(() => {
  const target = useCamera((s) => s.camera.target);
  const walls = useGame((s) => s.instance?.data.walls ?? EMPTY_WALLS);

  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const addChestAt = useGame((s) => s.chest.addAt);
  const moveChestTo = useGame((s) => s.chest.moveTo);
  const addMonsterAt = useGame((s) => s.monster.addAt);
  const addWallAt = useGame((s) => s.wall.addAt);
  const deleteWallAt = useGame((s) => s.wall.deleteAt);
  const addWallArea = useGame((s) => s.wall.addArea);
  const deleteWallArea = useGame((s) => s.wall.deleteArea);
  const current = useGame((s) => s.sequence.current);
  const moveTo = useGame((s) => s.movement.moveTo);
  const castAbility = useGame((s) => s.abilities.useAt);

  const ability = mode.type === "ability" ? mode.ability : undefined;
  const actions =
    current?.actions ??
    (current && current.type !== "chest" ? current.playable.maxActions : 0) ??
    0;

  const position = Render.getTilePosition(target);
  const isWithinRenderDistance = React.useCallback(
    (point: { x: number; z: number }) =>
      Render.distance(position, point, "chebyshev") <= RENDER_DISTANCE,
    [position]
  );

  const [hoverPos, setHoverPos] = React.useState<{ x: number; z: number } | null>(null);

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    const point = Render.getTilePosition(e.point);

    switch (mode.type) {
      case "monster:place":
        addMonsterAt(mode.monsterId, { x: point.x, z: point.z });
        setMode({ type: "normal" });
        break;
      case "chest:place":
        addChestAt({ x: point.x, z: point.z });
        setMode({ type: "normal" });
        break;
      case "chest:move":
        moveChestTo(mode.entityId, { x: point.x, z: point.z });
        setMode({ type: "normal" });
        break;
      case "wall:place":
        addWallAt(Render.getTilePosition(point));
        break;
      case "wall:place-area":
        if (!mode.start) {
          setMode({ type: "wall:place-area", start: { x: point.x, z: point.z } });
        } else {
          addWallArea(mode.start, { x: point.x, z: point.z });
          setMode({ type: "normal" });
        }
        break;
      case "wall:destroy-area":
        if (!mode.start) {
          setMode({ type: "wall:destroy-area", start: { x: point.x, z: point.z } });
        } else {
          deleteWallArea(mode.start, { x: point.x, z: point.z });
          setMode({ type: "normal" });
        }
        break;
      default:
        if (ability && current && actions > 0) castAbility({ x: point.x, z: point.z });
        break;
    }
  };

  const handleFloorMove = (e: ThreeEvent<PointerEvent>) => {
    if (mode.type === "wall:place-area" || mode.type === "wall:destroy-area") {
      const point = Render.getTilePosition(e.point);
      setHoverPos({ x: point.x, z: point.z });
    }
  };

  const areaStart =
    mode.type === "wall:place-area" || mode.type === "wall:destroy-area" ? mode.start : undefined;
  const areaPreview = React.useMemo(() => {
    const corner = areaStart;
    const hover = hoverPos;
    if (!corner || !hover) return [];
    const minX = Math.min(corner.x, hover.x);
    const maxX = Math.max(corner.x, hover.x);
    const minZ = Math.min(corner.z, hover.z);
    const maxZ = Math.max(corner.z, hover.z);
    const tiles: { x: number; z: number }[] = [];
    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        tiles.push({ x, z });
      }
    }
    return tiles;
  }, [areaStart, hoverPos]);

  const visibleAreaPreview = React.useMemo(
    () => areaPreview.filter((point) => isWithinRenderDistance(point)),
    [areaPreview, isWithinRenderDistance]
  );

  const viable = React.useMemo(() => {
    if (!current) return [];
    return useGame.getState().movement.getViable(current.id);
  }, [current]);

  const visibleViable = React.useMemo(
    () => viable.filter((point) => isWithinRenderDistance(point)),
    [viable, isWithinRenderDistance]
  );

  const viableAbility = React.useMemo(() => {
    if (!current || !ability) return [];
    return useGame.getState().abilities.getViable(current.id, ability);
  }, [current, ability]);

  const visibleViableAbility = React.useMemo(
    () => viableAbility.filter((point) => isWithinRenderDistance(point)),
    [viableAbility, isWithinRenderDistance]
  );

  const visibleWalls = React.useMemo(
    () => walls.filter((wall) => isWithinRenderDistance(wall)),
    [walls, isWithinRenderDistance]
  );

  const handleWallClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const index = e.instanceId;
    const point = Render.getTilePosition(e.point);
    switch (mode.type) {
      case "wall:place":
        addWallAt(point);
        break;
      case "wall:destroy":
        if (index !== undefined && visibleWalls[index]) {
          deleteWallAt(visibleWalls[index]);
        } else deleteWallAt(point);
        break;
      default:
        handleFloorClick(e);
        break;
    }
  };

  return (
    <>
      <FloorPlane position={position} onClick={handleFloorClick} onPointerMove={handleFloorMove} />

      {mode.type === "character:move" && (
        <MoveTiles
          tiles={visibleViable}
          current={current as Game.Entity | undefined}
          actions={actions}
          y={position.y}
          onMoveAction={moveTo}
          onEndModeAction={() => setMode({ type: "normal" })}
        />
      )}

      <AbilityTiles
        active={Boolean(ability)}
        tiles={visibleViableAbility}
        current={current as Game.Entity | undefined}
        actions={actions}
        y={position.y}
        onCastAction={castAbility}
        onCancelAction={() => setMode({ type: "normal" })}
        center={position}
      />

      <AreaPreview
        tiles={visibleAreaPreview}
        y={position.y}
        isDestroy={mode.type === "wall:destroy-area"}
      />

      <gridHelper args={[50, 50, "#444444"]} position={[position.x, position.y, position.z]} />

      <WallsMesh walls={visibleWalls} onClickAction={handleWallClick} />
    </>
  );
});
