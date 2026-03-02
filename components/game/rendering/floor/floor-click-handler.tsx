"use client";

import { useFloorClick } from "@/lib/hooks/use-floor-click";
import { useGame } from "@/lib/hooks/use-game";
import { Render } from "@/lib/render";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

type Props = { viableAbility: Array<{ x: number; z: number }> };

export const FloorClickHandler = ({ viableAbility }: Props) => {
  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const addChestAt = useGame((s) => s.chest.addAt);
  const moveChestTo = useGame((s) => s.chest.moveTo);
  const addCampfireAt = useGame((s) => s.campfire.addAt);
  const moveCampfireTo = useGame((s) => s.campfire.moveTo);
  const addMonsterAt = useGame((s) => s.monster.addAt);
  const addWallAt = useGame((s) => s.wall.addAt);
  const addWallArea = useGame((s) => s.wall.addArea);
  const deleteWallArea = useGame((s) => s.wall.deleteArea);
  const current = useGame((s) => s.sequence.current);
  const actions =
    current?.actions ??
    (current && (current.type === "character" || current?.type === "monster")
      ? current.playable.maxActions
      : 0) ??
    0;

  const abilityMode = mode.type === "ability" ? mode : undefined;
  const ability = abilityMode?.ability;

  React.useEffect(() => {
    const handleFloorClick = (e: ThreeEvent<MouseEvent>, point: { x: number; z: number }) => {
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
        case "campfire:place":
          addCampfireAt({ x: point.x, z: point.z });
          setMode({ type: "normal" });
          break;
        case "campfire:move":
          moveCampfireTo(mode.entityId, { x: point.x, z: point.z });
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
          if (!ability || !current || actions <= 0) return;
          if (!viableAbility.some((tile) => tile.x === point.x && tile.z === point.z)) return;
          setMode({ type: "ability", ability, target: { x: point.x, z: point.z } });
          break;
      }
    };

    const addFloorClickCallback = useFloorClick.getState().addFloorClickCallback;
    const removeFloorClickCallback = useFloorClick.getState().removeFloorClickCallback;

    addFloorClickCallback(handleFloorClick);

    return () => {
      removeFloorClickCallback(handleFloorClick);
    };
  }, [
    mode,
    setMode,
    addMonsterAt,
    addChestAt,
    moveChestTo,
    addCampfireAt,
    moveCampfireTo,
    addWallAt,
    addWallArea,
    deleteWallArea,
    current,
    ability,
    actions,
    viableAbility,
  ]);

  return null;
};
