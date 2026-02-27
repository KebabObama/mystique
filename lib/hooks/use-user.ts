"use client";

import { User } from "better-auth";
import { create } from "zustand";

export const useUser = create<User | undefined>()(() => undefined);
