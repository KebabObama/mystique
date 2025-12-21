"use client";

import type { User } from "@/types/communication";
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
  useUser.setState(user);
  return <>{children}</>;
};
