"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";
import { SendHorizonal } from "lucide-react";

/** Renders the end turn component. */
export const EndTurn = () => {
  const canEnd = usePermissions((s) => s.canEndTurn);
  const next = useGame((s) => s.sequence.next);

  return (
    <Button size="sm" disabled={!canEnd} onClick={next}>
      <SendHorizonal /> End turn
    </Button>
  );
};
