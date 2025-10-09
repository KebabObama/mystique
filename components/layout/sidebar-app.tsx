"use client";
import * as Sidebar from "@/components/ui/sidebar";
import { Border } from "../ui/border";

export function SidebarApp() {
  return (
    <Sidebar.Sidebar
      variant="floating"
      collapsible="icon"
      className="relative my-4 ml-4 h-[calc(100dvh-2rem)] p-0"
    >
      <Border />

      <Sidebar.SidebarFooter></Sidebar.SidebarFooter>
    </Sidebar.Sidebar>
  );
}
