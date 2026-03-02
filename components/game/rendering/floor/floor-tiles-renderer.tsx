"use client";

import { Game } from "@/lib/game";
import { GameMode, GameStore } from "@/lib/hooks/use-game";
import { AbilityTiles } from "./ability-tiles";
import { AreaPreview } from "./area-preview";
import { MoveTiles } from "./move-tiles";
import { FloorTiles } from "./use-floor-tiles";

type Props = {
  mode: GameMode;
  setModeAction: GameStore["setMode"];
  current: Game.Entity | undefined;
  moveToAction: GameStore["movement"]["moveTo"];
  actions: number;
  tiles: FloorTiles;
  floorPositionY: number;
  floorCenter: { x: number; y: number; z: number };
};

export const FloorTilesRenderer = ({
  mode,
  setModeAction,
  current,
  moveToAction,
  actions,
  tiles,
  floorPositionY,
  floorCenter,
}: Props) => {
  const ability = mode.type === "ability" ? mode.ability : undefined;
  const selectedAbilityTarget = mode.type === "ability" ? mode.target : undefined;
  const wallAreaStart =
    mode.type === "wall:place-area" || mode.type === "wall:destroy-area" ? mode.start : undefined;

  return (
    <>
      {mode.type === "character:move" && (
        <MoveTiles
          tiles={tiles.visibleViable}
          current={current}
          actions={actions}
          y={floorPositionY}
          onMoveAction={moveToAction}
          onEndModeAction={() => setModeAction({ type: "normal" })}
        />
      )}

      <AbilityTiles
        active={Boolean(ability)}
        tiles={tiles.visibleViableAbility}
        selectedTarget={selectedAbilityTarget}
        current={current}
        actions={actions}
        y={floorPositionY}
        onSelectAction={(target) => {
          if (!ability) return;
          setModeAction({ type: "ability", ability, target });
        }}
        onCancelAction={() => setModeAction({ type: "normal" })}
        center={floorCenter}
      />

      <AreaPreview tiles={tiles.visibleAbilityImpactTiles} y={floorPositionY} color="orange" />

      <AreaPreview
        tiles={tiles.visibleAreaPreview}
        y={floorPositionY}
        isDestroy={mode.type === "wall:destroy-area"}
      />
    </>
  );
};

