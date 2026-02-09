"use client";

import { useGame } from "@/hooks/use-game";
import React from "react";

export const LogEffect = () => {
  const instance = useGame((s) => s.instance);

  React.useEffect(() => {
    console.log(instance);
  }, [instance]);

  return null;
};

