"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";
import { Move } from "lucide-react";

/** Renders the move button component. */
export const MoveButton = () => {
  const current = useGame((s) => s.sequence.current);
  const setMode = useGame((s) => s.setMode);
  const canControlCurrent = usePermissions((s) => s.canControlCurrent);
  const isMasterOnTurn = usePermissions((s) => s.isMasterOnTurn);
  const canHaveActions = current?.type === "character" || current?.type === "monster";
  const actions = current?.actions ?? (canHaveActions ? current.maxActions : 0) ?? 0;
  const currentHp = canHaveActions ? (current?.hp ?? current?.maxHp ?? 0) : 1;

  if (!current) return null;

  if (current.type === "character" || current.type === "monster") {
    if (!canControlCurrent || actions <= 0 || currentHp <= 0) return null;
    return (
      <Button size="sm" onClick={() => setMode({ type: "character:move" })}>
        <Move /> Move
      </Button>
    );
  }

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
