import { Header } from "@/components/layout/header";
import { SidebarApp } from "@/components/layout/sidebar-app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider className="h-dvh w-dvw overflow-hidden">
      <SidebarApp />
      <main className="relative h-full w-full space-y-6 overflow-x-hidden overflow-y-auto px-6 py-4">
        <Header />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
};
