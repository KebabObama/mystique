"use client";

import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGame } from "@/lib/hooks/use-game";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { cn } from "@/lib/utils";
import { Game } from "@/types";

type AbilityCardProps = { ability: Game.Ability; selected: boolean; onSelect: () => void };

const AbilityCard = ({ ability, selected, onSelect }: AbilityCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col rounded-md border p-2 text-left transition",
        selected && "border-primary bg-primary/10"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{ability.name}</span>
        <span className="text-muted text-xs">Cost: {ability.cost}</span>
      </div>
      <div className="text-muted mt-1 flex items-center justify-between text-xs">
        <span>Range: {ability.range}</span>
        <span>Targeting: {ability.targeting}</span>
        <span>
          {ability.amount[0]} - {ability.amount[1]}
        </span>
      </div>
    </button>
  );
};

export const AbilitiesDrawer = () => {
  const current = useGame((s) => s.sequence.current);
  const canControlCurrent = usePermissions((s) => s.canControlCurrent);
  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const castAbilityAt = useGame((s) => s.abilities.useAt);
  const getViableTargets = useGame((s) => s.abilities.getViable);

  if (!canControlCurrent || !current) return null;
  const canHaveActions = current.type === "character" || current.type === "monster";
  const actions = current.actions ?? (canHaveActions ? current.maxActions : 0) ?? 0;
  const abilities = InGameHelpers.getEntityAbilities(current);
  const selectedAbility = mode.type === "ability" ? mode.ability : undefined;
  const selectedTarget = mode.type === "ability" ? mode.target : undefined;
  const hasActionsForSelected = selectedAbility ? actions >= selectedAbility.cost : false;
  const viableSelectedTargets = selectedAbility
    ? getViableTargets(current.id, selectedAbility)
    : [];
  const canCastSelected =
    Boolean(selectedAbility && selectedTarget && hasActionsForSelected) &&
    viableSelectedTargets.some(
      (tile) => tile.x === selectedTarget?.x && tile.z === selectedTarget?.z
    );

  return (
    <div className="flex flex-col gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm">
            {selectedAbility ? `Ability: ${selectedAbility.name}` : "Abilities"}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="absolute mx-auto mb-4 max-h-[40vh] max-w-2xl">
          <Border />
          <SheetHeader className="px-2 pb-2">
            <SheetTitle>Abilities</SheetTitle>
          </SheetHeader>
          <div className="grid gap-2 overflow-auto px-2 pb-6">
            {abilities.length === 0 && (
              <div className="text-muted text-center text-sm">No abilities available.</div>
            )}
            {abilities.map((ability) => {
              const selected = selectedAbility?.name === ability.name;
              return (
                <AbilityCard
                  key={`${ability.name}-${ability.effects}`}
                  ability={ability}
                  selected={selected}
                  onSelect={() => {
                    if (selected) {
                      setMode({ type: "normal" });
                      return;
                    }
                    setMode({ type: "ability", ability });
                  }}
                />
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {selectedAbility && (
        <Button
          size="sm"
          variant="outline"
          disabled={!canCastSelected}
          onClick={() => {
            if (!selectedTarget) return;
            castAbilityAt(selectedTarget);
          }}
        >
          {selectedTarget
            ? `Cast ${selectedAbility.name} at (${selectedTarget.x}, ${selectedTarget.z})`
            : `Select target for ${selectedAbility.name}`}
        </Button>
      )}
    </div>
  );
};
