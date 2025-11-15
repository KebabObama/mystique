import SidebarApp from "@/components/layout/sidebar-app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { CommunicationProvider } from "@/hooks/use-communication";
import { UserProvider } from "@/hooks/use-user";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <CommunicationProvider>
        <SidebarProvider className="h-dvh w-dvw overflow-hidden">
          <SidebarApp />
          <main className="relative h-full w-full">{children}</main>
          <Toaster />
        </SidebarProvider>
      </CommunicationProvider>
    </UserProvider>
  );
};
