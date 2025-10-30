import Sidebar from "@/components/layout/sidebar-app";
import { SidebarProvider } from "@/components/ui/sidebar";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider className="h-dvh w-dvw overflow-hidden">
      <Sidebar />
      <main className="relative h-full w-full">{children}</main>
    </SidebarProvider>
  );
};
