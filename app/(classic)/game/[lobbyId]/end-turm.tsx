"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { SendHorizonal } from "lucide-react";

export const EndTurn = () => {
  const canEnd = useGame((s) => s.sequence.canEnd);
  const next = useGame((s) => s.sequence.next);

  return (
    <Button disabled={!canEnd} onClick={next}>
      <SendHorizonal /> End turn
    </Button>
  );
};
