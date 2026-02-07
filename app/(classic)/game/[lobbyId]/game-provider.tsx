"use client";

import { useGame } from "@/hooks/use-game";
import { useSocket } from "@/hooks/use-socket";
import React from "react";

type GameProviderProps = { children?: React.ReactNode; lobbyId: string };

export const GameProvider = ({ children, lobbyId }: GameProviderProps) => {
  const joinInstance = useGame((s) => s.joinInstance);
  const leaveInstance = useGame((s) => s.leaveInstance);
  const connected = useSocket((s) => s.connected);

  React.useEffect(() => {
    if (!connected) return;
    joinInstance(lobbyId);
    return () => {
      leaveInstance();
    };
  }, [connected, lobbyId, joinInstance, leaveInstance]);

  return <>{children}</>;
};

