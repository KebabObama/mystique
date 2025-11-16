"use client";

import { CommunicationProvider } from "@/hooks/use-communication";
import { UserProvider } from "@/hooks/use-user";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <CommunicationProvider>{children}</CommunicationProvider>
    </UserProvider>
  );
};
