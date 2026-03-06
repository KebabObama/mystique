"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/hooks/use-game";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { Move } from "lucide-react";

export const MoveButton = () => {
  const current = useGame((s) => s.sequence.current);
  const setMode = useGame((s) => s.setMode);
  const canControlCurrent = usePermissions((s) => s.canControlCurrent);
  const isMasterOnTurn = usePermissions((s) => s.isMasterOnTurn);
  const canHaveActions = current?.type === "character" || current?.type === "monster";
  const actions = current?.actions ?? (canHaveActions ? current.maxActions : 0) ?? 0;

  if (!current) return null;

  // Show for characters and monsters when you can control them
  if (current.type === "character" || current.type === "monster") {
    if (!canControlCurrent || actions <= 0) return null;
    return (
      <Button size="sm" onClick={() => setMode({ type: "character:move" })}>
        <Move /> Move
      </Button>
    );
  }

  // Show for chests and campfires when master is on turn
  if (current.type === "chest") {
    if (!isMasterOnTurn) return null;
    return (
      <Button size="sm" onClick={() => setMode({ type: "chest:move", entityId: current.id })}>
        <Move /> Move
      </Button>
    );
  }

  if (current.type === "campfire") {
    if (!isMasterOnTurn) return null;
    return (
      <Button size="sm" onClick={() => setMode({ type: "campfire:move", entityId: current.id })}>
        <Move /> Move
      </Button>
    );
  }

  return null;
};
