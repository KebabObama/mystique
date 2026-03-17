"use client";

import { User } from "better-auth";
import { create } from "zustand";

/** Provides the Zustand store for user. */
export const useUser = create<User | undefined>()(() => undefined);
