"use client";

import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGame } from "@/hooks/use-game";
import { Game } from "@/lib/game";
import { cn } from "@/lib/utils";

type AbilityCardProps = {
  ability: Game.Ability;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
};

const AbilityCard = ({ ability, selected, disabled, onSelect }: AbilityCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "flex w-full flex-col rounded-md border p-2 text-left transition",
        selected && "border-primary bg-primary/10",
        disabled && "opacity-60"
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
  const canControlCurrent = useGame((s) => s.sequence.canControl);
  const normalMode = useGame((s) => s.actions.normalMode);
  const moveMode = useGame((s) => s.actions.moveMode);
  const setNormalMode = useGame((s) => s.actions.setNormalMode);
  const setMoveMode = useGame((s) => s.actions.setMoveMode);
  const actions = current?.actions ?? current?.playable.maxActions ?? 0;

  if (!canControlCurrent || !current) return null;
  const abilities = Game.getEntityAbilities(current);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>{normalMode ? `Ability: ${normalMode.name}` : "Abilities"}</Button>
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
          {abilities.map((ability, index) => {
            const disabled = actions < ability.cost;
            const selected = normalMode?.name === ability.name;
            return (
              <AbilityCard
                key={`${ability.name}-${index}`}
                ability={ability}
                selected={selected}
                disabled={disabled}
                onSelect={() => {
                  if (selected) {
                    setNormalMode(undefined);
                    return;
                  }
                  if (moveMode) setMoveMode(false);
                  setNormalMode(ability);
                }}
              />
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
