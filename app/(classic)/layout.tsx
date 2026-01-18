import { Header } from "@/components/layout/header";
import { SidebarApp } from "@/components/layout/sidebar-app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LobbyProvider } from "@/hooks/use-lobby";
import { UserProvider } from "@/hooks/use-user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Toaster } from "sonner";

export default async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <SidebarProvider className="h-dvh w-dvw overflow-hidden">
      <SidebarApp />
      <main className="relative h-full w-full space-y-6 overflow-x-hidden overflow-y-auto px-6 py-4">
        <Header />
        <UserProvider user={session?.user}>
          <LobbyProvider>{children}</LobbyProvider>
        </UserProvider>
      </main>
      <Toaster />
    </SidebarProvider>
  );
};
