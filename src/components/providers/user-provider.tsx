"use client";

import { useGame } from "@/lib/hooks/use-game";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { useUser } from "@/lib/hooks/use-user";
import { User } from "better-auth";
import React from "react";

export const UserProvider = ({ children, user }: { children: React.ReactNode; user?: User }) => {
  React.useEffect(() => {
    useUser.setState(user);
    usePermissions.getState().update(useGame.getState().instance);
  }, [user]);

  return <>{children}</>;
};
