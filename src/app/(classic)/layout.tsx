import { Header } from "@/components/layout/header";
import { SidebarApp } from "@/components/layout/sidebar-app";
import { SocketProvider } from "@/components/providers/socket-provider";
import { UserProvider } from "@/components/providers/user-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Toaster } from "sonner";

/** Renders the home layout. */
export default async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <SidebarProvider className="h-dvh w-dvw overflow-hidden">
      <SidebarApp />
      <main className="relative h-full w-full space-y-6 overflow-x-hidden overflow-y-auto px-6 py-4">
        <Header />
        <UserProvider user={session?.user}>
          <SocketProvider>{children}</SocketProvider>
        </UserProvider>
      </main>
      <Toaster />
    </SidebarProvider>
  );
};
