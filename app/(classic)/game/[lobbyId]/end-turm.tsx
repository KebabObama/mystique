"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { SendHorizonal } from "lucide-react";

export const EndTurn = () => {
  const send = useGame((s) => s.send);
  const inst = useGame((s) => s.instance);
  const userId = useUser((s) => s.id);

  if (!inst || !userId) return null;

  const isRoundStart = inst.turn === -1;
  const isMaster = inst.masterId === userId;

  const activeCharacterId = isRoundStart ? null : inst.sequence[inst.turn];

  const ownsActiveCharacter =
    !!activeCharacterId &&
    inst.characters.some((c) => c.id === activeCharacterId && c.ownerId === userId);

  const canEndTurn = (isRoundStart && isMaster) || (!isRoundStart && ownsActiveCharacter);

  return (
    <Button onClick={() => send("sequence:next", activeCharacterId)} disabled={!canEndTurn}>
      <SendHorizonal /> End turn
    </Button>
  );
};

