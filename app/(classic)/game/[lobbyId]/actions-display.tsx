"use client";

import { Card } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";

export const ActionsDisplay = () => {
  const current = useGame((s) => s.sequence.current);
  const canControl = useGame((s) => s.sequence.canControl);
  const actions = current?.actions ?? current?.playable.maxActions ?? 0;
  if (!canControl) return null;
  return <Card className="p-0.5 text-sm">Actions: {actions}</Card>;
};
