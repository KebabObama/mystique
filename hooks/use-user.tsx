"use client";

import { authClient } from "@/lib/auth-client";
import { mer } from "@/lib/mer";
import { User as BetterUser } from "better-auth";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type User = Omit<
  BetterUser,
  "createdAt" | "updatedAt" | "emailVerified"
>;

export const useUser = create<User>()(
  devtools(
    persist((set) => ({ name: "", id: "", email: "", image: "" }), {
      name: "userStore",
    })
  )
);

export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data } = authClient.useSession();
  if (data) {
    useUser.setState(
      mer((e) => {
        ((e.name = data.user.name),
          (e.id = data.user.id),
          (e.email = data.user.email),
          (e.image = data.user.image));
      })
    );
    console.log(useUser.getState());
  }

  return <>{children}</>;
}
