"use client";

import { useGame } from "@/hooks/use-game";
import { useSocket } from "@/hooks/use-socket";
import { usePathname } from "next/navigation";
import React from "react";

type GameProviderProps = { children?: React.ReactNode; lobbyId: string };

export const GameProvider = ({ children, lobbyId }: GameProviderProps) => {
  const joinInstance = useGame((s) => s.joinInstance);
  const leaveInstance = useGame((s) => s.leaveInstance);
  const instance = useGame((s) => s.instance);
  const connected = useSocket((s) => s.connected);
  const pathname = usePathname();

  React.useEffect(() => {
    if (!connected) return;
    joinInstance(lobbyId);
    return () => {
      leaveInstance();
    };
  }, [connected, lobbyId, joinInstance, leaveInstance]);

  // Detect when user navigates away from the game page
  React.useEffect(() => {
    const isOnGamePage = pathname?.startsWith("/game/");
    if (!isOnGamePage && instance) {
      leaveInstance();
    }
  }, [pathname, instance, leaveInstance]);

  return <>{children}</>;
};
