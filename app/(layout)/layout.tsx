import { SidebarApp } from "@/components/layout/sidebar-app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/hooks/use-user";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SidebarProvider className="h-dvh w-dvw overflow-hidden">
        <SidebarApp />
        <main className="relative h-full w-full">{children}</main>
      </SidebarProvider>
    </UserProvider>
  );
}
