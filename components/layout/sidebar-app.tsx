"use client";
import * as Sidebar from "@/components/ui/sidebar";
import { SidebarIcon } from "lucide-react";
import { Border } from "../ui/border";
import { Button } from "../ui/button";

export function SidebarApp() {
  const { toggleSidebar, open } = Sidebar.useSidebar();
  return (
    <Sidebar.Sidebar
      variant="floating"
      collapsible="icon"
      className="bg-card relative my-4 ml-4 h-[calc(100dvh-2rem)] p-0"
    >
      <Border />
      <Sidebar.SidebarHeader className="flex flex-col items-center justify-start">
        <Sidebar.SidebarMenuButton onClick={toggleSidebar} asChild>
          <Button
            className="justify-between overflow-visible"
            variant={"outline"}
            size={"sm"}
          >
            <SidebarIcon />
            <span className="truncate overflow-hidden" hidden={!open}>
              Open Sidebar
            </span>
          </Button>
        </Sidebar.SidebarMenuButton>
      </Sidebar.SidebarHeader>
      <Sidebar.SidebarFooter></Sidebar.SidebarFooter>
    </Sidebar.Sidebar>
  );
}
