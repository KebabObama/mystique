"use client";

import { User } from "better-auth";
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

export const UserProvider = ({ children, user }: { children: React.ReactNode; user: User }) => {
  const ref = React.useRef<boolean>(true);
  if (ref.current) {
    useUser.setState(user);
    ref.current = false;
  }
  return <>{children}</>;
};
