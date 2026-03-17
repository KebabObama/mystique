"use client";

import { useGame } from "@/hooks/use-game";

/** Renders the log effect component. */
export const LogEffect = () => {
  useGame((s) => s.instance);

  return null;
};
