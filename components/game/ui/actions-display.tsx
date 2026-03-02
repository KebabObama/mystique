"use client";

import { Card } from "@/components/ui/card";
import { useGame } from "@/lib/hooks/use-game";

export const ActionsDisplay = () => {
  const current = useGame((s) => s.sequence.current);
  const canControl = useGame((s) => s.sequence.canControl);
  // @ts-ignore
  const actions = current?.actions ?? current?.playable.maxActions ?? 0;
  return (
    canControl && (
      <Card className="px-2 py-1.5 text-sm font-semibold">Remaining actions: {actions}</Card>
    )
  );
};
