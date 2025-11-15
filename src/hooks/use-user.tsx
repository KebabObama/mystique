"use client";

import { authClient } from "@/lib/auth-client";
import { User } from "@/types/communication";
import React from "react";
import { create } from "zustand";

const defaults = {
  id: "",
  name: "",
  email: "",
  emailVerified: false,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useUser = create<User>()(() => defaults);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = authClient.useSession();
  React.useEffect(() => {
    useUser.setState(data?.user || defaults);
    console.log(data?.user);
  }, [data]);
  return <>{children}</>;
};
