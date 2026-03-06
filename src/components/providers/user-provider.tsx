"use client";

import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";
import { useUser } from "@/hooks/use-user";
import { User } from "better-auth";
import React from "react";

export const UserProvider = ({ children, user }: { children: React.ReactNode; user?: User }) => {
  React.useEffect(() => {
    useUser.setState(user);
    usePermissions.getState().update(useGame.getState().instance);
  }, [user]);

  return <>{children}</>;
};
