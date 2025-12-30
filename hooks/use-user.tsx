"use client";

import { User } from "better-auth";
import React from "react";
import { create } from "zustand";

const defaults: User = {
  id: "",
  name: "",
  email: "",
  emailVerified: false,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useUser = create<User>()(() => defaults);
export const UserProvider = ({ children, user }: { children: React.ReactNode; user?: User }) => {
  React.useEffect(() => {
    useUser.setState(user || defaults);
  }, [user]);
  return <>{children}</>;
};

