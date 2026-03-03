"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/hooks/use-game";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { SendHorizonal } from "lucide-react";

export const EndTurn = () => {
  const canEnd = usePermissions((s) => s.canEndTurn);
  const next = useGame((s) => s.sequence.next);

  return (
    <Button size="sm" disabled={!canEnd} onClick={next}>
      <SendHorizonal /> End turn
    </Button>
  );
};
