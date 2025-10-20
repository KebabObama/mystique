import { SidebarApp } from "@/components/layout/sidebar-app";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-dvh w-dvw overflow-hidden">
      <SidebarApp />
      <main className="relative h-full w-full">{children}</main>
    </SidebarProvider>
  );
}
