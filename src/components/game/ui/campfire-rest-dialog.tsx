"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useDialog } from "@/lib/hooks/use-dialog";
import { useGame } from "@/lib/hooks/use-game";
import React from "react";

export const CampfireRestDialog = () => {
  const instance = useGame((s) => s.instance);
  const open = useDialog((s) => s.campfire.restDialogOpen);
  const closeRest = useDialog((s) => s.campfire.closeRest);
  const selectedCharacterId = useDialog((s) => s.campfire.selectedCharacterId);
  const [actionsToRest, setActionsToRest] = React.useState(1);

  if (!open || !selectedCharacterId || !instance) return null;

  const charEntity = instance.entities.find((e) => e.id === selectedCharacterId);
  if (!charEntity || charEntity.type !== "character") return null;

  const maxActions = charEntity.actions ?? charEntity.playable.maxActions ?? 0;
  const healing = Math.min(
    actionsToRest * 20, // Max 20% of maxHp per action spent
    charEntity.playable.maxHp
  );
  const projectedHp = Math.min(charEntity.playable.hp + healing, charEntity.playable.maxHp);

  const handleRest = () => {
    useGame.getState().send("campfire:rest", selectedCharacterId, actionsToRest);
    closeRest();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeRest()}>
      <Dialog.Content>
        <Dialog.Title>Rest at Campfire</Dialog.Title>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Actions to spend resting: {actionsToRest} / {maxActions}
            </label>
            <Slider
              value={[actionsToRest]}
              onValueChange={(value) => setActionsToRest(value[0])}
              min={1}
              max={maxActions}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="space-y-2 rounded-lg bg-slate-100 p-3">
            <p className="text-sm">
              <span className="font-medium">Current HP:</span> {charEntity.playable.hp} /
              {charEntity.playable.maxHp}
            </p>
            <p className="text-sm">
              <span className="font-medium">Healing:</span> +{healing}
            </p>
            <p className="text-sm">
              <span className="font-medium">After rest:</span> {projectedHp} /
              {charEntity.playable.maxHp}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRest} className="flex-1">
              Rest
            </Button>
            <Button onClick={closeRest} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
