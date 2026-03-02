"use client";

import { Game } from "@/lib/game";
import { useGame } from "@/lib/hooks/use-game";
import React from "react";
import { FloorPosition } from "./use-floor-position";

export type FloorTiles = {
  viable: Array<{ x: number; z: number }>;
  visibleViable: Array<{ x: number; z: number }>;
  viableAbility: Array<{ x: number; z: number }>;
  visibleViableAbility: Array<{ x: number; z: number }>;
  abilityImpactTiles: Array<{ x: number; z: number }>;
  visibleAbilityImpactTiles: Array<{ x: number; z: number }>;
  areaPreview: Array<{ x: number; z: number }>;
  visibleAreaPreview: Array<{ x: number; z: number }>;
};

type Props = {
  floorPosition: FloorPosition;
  current: Game.Entity | undefined;
  ability: Game.Ability | undefined;
  selectedAbilityTarget: Game.Position | undefined;
  wallAreaStart: Game.Position | undefined;
  hoverPos: Game.Position | null;
};

export const useFloorTiles = ({
  floorPosition,
  current,
  ability,
  selectedAbilityTarget,
  wallAreaStart,
  hoverPos,
}: Props): FloorTiles => {
  const { position, isWithinRenderDistance } = floorPosition;

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

  const abilityImpactTiles = React.useMemo(() => {
    if (!ability || !selectedAbilityTarget || ability.targeting <= 0) return [];
    return Game.getAbilityImpactTiles(selectedAbilityTarget, ability.targeting);
  }, [ability, selectedAbilityTarget]);

  const visibleAbilityImpactTiles = React.useMemo(
    () => abilityImpactTiles.filter((point) => isWithinRenderDistance(point)),
    [abilityImpactTiles, isWithinRenderDistance]
  );

  const areaPreview = React.useMemo(() => {
    const corner = wallAreaStart;
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
  }, [wallAreaStart, hoverPos]);

  const visibleAreaPreview = React.useMemo(
    () => areaPreview.filter((point) => isWithinRenderDistance(point)),
    [areaPreview, isWithinRenderDistance]
  );

  return {
    viable,
    visibleViable,
    viableAbility,
    visibleViableAbility,
    abilityImpactTiles,
    visibleAbilityImpactTiles,
    areaPreview,
    visibleAreaPreview,
  };
};

