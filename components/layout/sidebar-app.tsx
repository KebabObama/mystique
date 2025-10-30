"use client";
import * as Sidebar from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { SidebarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";
import { Button } from "../ui/button";

export default () => {
  const { toggleSidebar, open } = Sidebar.useSidebar();
  const { data } = authClient.useSession();

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
          >
            <SidebarIcon />
            <span className="truncate overflow-hidden" hidden={!open}>
              Open Sidebar
            </span>
          </Button>
        </Sidebar.SidebarMenuButton>
      </Sidebar.SidebarHeader>
      <Sidebar.SidebarContent></Sidebar.SidebarContent>
      <Sidebar.SidebarFooter>
        <Sidebar.SidebarMenuButton className="mb-2 flex flex-row gap-6 overflow-visible">
          <Avatar className="-p-2 -ml-0.5 scale-90 overflow-visible">
            <AvatarImage src={data?.user.image as string} />
            <AvatarFallback />
          </Avatar>
          <span className="text-lg"> {data?.user.name}</span>
        </Sidebar.SidebarMenuButton>
      </Sidebar.SidebarFooter>
    </Sidebar.Sidebar>
  );
};
