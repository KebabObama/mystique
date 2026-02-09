"use client";

import { useUser } from "@/hooks/use-user";
import { User } from "better-auth";
import React from "react";

export const UserProvider = ({ children, user }: { children: React.ReactNode; user?: User }) => {
  React.useEffect(() => {
    useUser.setState(user);
  }, [user]);

  return <>{children}</>;
};

