"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { Move } from "lucide-react";

export const MoveButton = () => {
  const userId = useUser((s) => s?.id);
  const instance = useGame((s) => s.instance);
  const current = useGame((s) => s.sequence.current);
  const setMode = useGame((s) => s.setMode);
  const actions =
    current?.actions ??
    (current && current.type !== "chest" ? current.playable.maxActions : 0) ??
    0;

  const isMyTurn = current?.type === "character" && current.playable.ownerId === userId;
  const canMoveMonster = current?.type === "monster" && instance?.masterId === userId;

  if (!isMyTurn && !canMoveMonster) return null;
  return (
    <Button disabled={actions <= 0} onClick={() => setMode({ type: "character:move" })}>
      <Move /> Move
    </Button>
  );
};
