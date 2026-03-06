"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Game } from "@/lib/game";
import { useDialog } from "@/lib/hooks/use-dialog";
import { useGame } from "@/lib/hooks/use-game";
import React from "react";

export const LevelUpDialog = () => {
  const instance = useGame((s) => s.instance);
  const open = useDialog((s) => s.leveling.dialogOpen);
  const closeDialog = useDialog((s) => s.leveling.closeDialog);
  const levelUp = useGame((s) => s.leveling.levelUp);
  const selectedCharacterId = useDialog((s) => s.leveling.selectedCharacterId);
  const [attributePoints, setAttributePoints] = React.useState<Record<Game.Attribute, number>>({
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
  });

  if (!open || !selectedCharacterId || !instance) return null;

  const character = Game.getEntities(instance).find(
    (e) => e.type === "character" && e.id === selectedCharacterId
  );

  if (!character || character.type !== "character") return null;

  const totalPointsSpent = Object.values(attributePoints).reduce((a, b) => a + b, 0);
  const canLevelUp = totalPointsSpent === 5;

  const handleAttributeChange = (attr: Game.Attribute, value: number) => {
    setAttributePoints({ ...attributePoints, [attr]: Math.max(0, value) });
  };

  const handleLevelUp = () => {
    if (canLevelUp) {
      levelUp(selectedCharacterId, attributePoints);
      closeDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <Dialog.Content>
        <Dialog.Title>Level Up!</Dialog.Title>
        <p className="text-sm text-slate-600">
          {character.name} has reached level {character.level + 1}
        </p>

        <div className="space-y-4">
          <p className="text-sm font-medium">
            Distribute 5 attribute points ({totalPointsSpent}/5):
          </p>

          {Game.ATTRIBUTES.map((attr) => {
            const Icon = Game.ATTRIBUTE_ICON[attr];
            const current = character.attributes[attr];
            const pointsAdded = attributePoints[attr] || 0;

            return (
              <div key={attr} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <label className="flex-1 text-sm font-medium capitalize">{attr}</label>
                  <span className="text-sm text-slate-600">
                    {current} → {current + pointsAdded}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={pointsAdded}
                    onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value) || 0)}
                    className="flex-1 rounded border border-slate-300 px-2 py-1"
                  />
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleAttributeChange(attr, pointsAdded + 1)}
                      disabled={totalPointsSpent >= 5}
                      size="sm"
                      variant="outline"
                    >
                      +
                    </Button>
                    <Button
                      onClick={() => handleAttributeChange(attr, Math.max(0, pointsAdded - 1))}
                      size="sm"
                      variant="outline"
                    >
                      −
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rounded-lg bg-blue-50 p-3 text-sm">
            <p className="mb-2 font-medium">After leveling up:</p>
            <ul className="space-y-1 text-xs">
              <li>• Full HP restoration</li>
              <li>• Attribute points applied</li>
              <li>• Stats recalculated</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleLevelUp} disabled={!canLevelUp} className="flex-1">
              Confirm Level Up ({totalPointsSpent}/5)
            </Button>
            <Button onClick={closeDialog} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
