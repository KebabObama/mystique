"use client";

import { Card } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useHoveredEntity } from "@/hooks/use-hovered-entity";
import { Game } from "@/lib/game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import React from "react";

type VisibleEffect = { effect: Game.Effect; stacks: number };

const EFFECT_LABELS: Record<Game.Effect, string> = {
  corroding: "Corroding",
  frostbite: "Frostbite",
  burning: "Burning",
  shocked: "Shocked",
};

const hasHealth = (entity: Game.Entity) => entity.type === "character" || entity.type === "monster";

const getTurnEffectStacks = (
  entity: Game.CharacterEntity | Game.MonsterEntity,
  effect: Game.Effect
) => {
  const activeStacks = Math.max(0, entity.activeEffects?.[effect] ?? 0);
  const storedStacks = Math.max(0, entity.effects?.[effect] ?? 0);
  const decayedActiveStacks = Math.max(activeStacks - 1, 0);
  return activeStacks + Math.max(storedStacks - decayedActiveStacks, 0);
};

const getVisibleEffects = (entity: Game.CharacterEntity | Game.MonsterEntity): VisibleEffect[] =>
  Game.EFFECTS.map((effect) => ({ effect, stacks: getTurnEffectStacks(entity, effect) })).filter(
    ({ stacks }) => stacks > 0
  );

const getDetails = (entity: Game.Entity) => {
  const details = [{ label: "Position", value: `${entity.position.x}, ${entity.position.z}` }];

  switch (entity.type) {
    case "character":
      return [
        ...details,
        { label: "Race", value: entity.race },
        { label: "Level", value: entity.level },
        { label: "Armor", value: entity.armor },
        { label: "Actions", value: `${entity.actions} / ${entity.maxActions}` },
      ];
    case "monster":
      return [
        ...details,
        { label: "Level", value: entity.level },
        { label: "Armor", value: entity.armor },
        { label: "Actions", value: `${entity.actions} / ${entity.maxActions}` },
        { label: "Abilities", value: entity.abilities.length },
      ];
    case "chest":
      return [
        ...details,
        { label: "Contents", value: entity.inventory.length },
        { label: "Type", value: "Storage" },
      ];
    case "campfire":
      return [
        ...details,
        { label: "Shop Items", value: entity.shopItems.length },
        { label: "Type", value: "Rest Point" },
      ];
    default:
      return details;
  }
};

/** Renders the entity hover card component. */
export const EntityHoverCard = () => {
  const instance = useGame((s) => s.instance);
  const hoveredEntityId = useHoveredEntity((s) => s.hoveredEntityId);
  const clearHoveredEntity = useHoveredEntity((s) => s.clearHoveredEntity);

  const entity = React.useMemo(() => {
    if (!instance || !hoveredEntityId) return undefined;
    return InGameHelpers.getEntityById(instance, hoveredEntityId);
  }, [hoveredEntityId, instance]);

  React.useEffect(() => {
    if (!hoveredEntityId) return;
    if (instance && entity) return;
    clearHoveredEntity(hoveredEntityId);
  }, [clearHoveredEntity, entity, hoveredEntityId, instance]);

  if (!entity) return null;

  const details = getDetails(entity);
  const visibleEffects = hasHealth(entity) ? getVisibleEffects(entity) : [];

  return (
    <div className="pointer-events-none absolute top-2 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-2">
      <Card className="bg-card/95 px-3 py-2 text-sm shadow-lg backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs uppercase">{entity.type}</p>
            <h2 className="truncate text-base font-bold">{entity.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs uppercase">Health</p>
            <p className="font-semibold">
              {hasHealth(entity) ? `${entity.hp} / ${entity.maxHp}` : "—"}
            </p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {details.map((detail) => (
            <div key={detail.label} className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{detail.label}</span>
              <span className="truncate font-semibold capitalize">{detail.value}</span>
            </div>
          ))}
        </div>
        {hasHealth(entity) && (
          <div className="mt-3 border-t pt-2">
            <p className="text-muted-foreground text-[11px] uppercase">Effects</p>
            {visibleEffects.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                {visibleEffects.map(({ effect, stacks }) => (
                  <span
                    key={effect}
                    className="bg-muted text-foreground rounded-full px-2 py-1 font-semibold"
                  >
                    {EFFECT_LABELS[effect]} ×{stacks}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-1 text-xs">None</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
