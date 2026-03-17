"use client";

import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import React from "react";

/** Renders the socket provider component. */
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const connect = useSocket((s) => s.connect);
  const disconnect = useSocket((s) => s.disconnect);
  const userId = useUser((s) => s?.id);

  React.useEffect(() => {
    if (!userId) return;
    (async () => {
      await fetch("/api/socket");
      connect();
    })();
    return () => disconnect();
  }, [userId, connect, disconnect]);

  return <>{children}</>;
};
