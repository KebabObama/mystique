"use client";

import { useLobby } from "@/hooks/use-lobby";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  useSidebar,
} from "../ui/sidebar";
import { CreateLobby } from "./create-lobby";
import { JoinLobby } from "./join-bobby";
import { SidebarLobbyItem } from "./sidebar-lobby-item";

export const SidebarMain = () => {
  const { lobbies } = useLobby();
  const { open } = useSidebar();
  return (
    <SidebarContent>
      <SidebarMenu
        className={`mb-0 flex-col items-center justify-start gap-2 p-2 pb-0 md:flex ${open ? "" : "h-full pb-1"}`}
      >
        <SidebarMenuButton onClick={() => redirect("/dashboard")} className="truncate text-lg">
          <LayoutDashboard />
          Dashboard
        </SidebarMenuButton>
        <JoinLobby />
        <CreateLobby />
        {!open && (
          <>
            <div className="mt-auto"></div>
            {lobbies.map((lobby) => (
              <SidebarLobbyItem lobby={lobby} key={lobby.id}>
                <SidebarMenuButton className="ml-1.5 text-center text-lg capitalize">
                  {lobby.name[0]}
                </SidebarMenuButton>
              </SidebarLobbyItem>
            ))}
          </>
        )}
      </SidebarMenu>
      {open && (
        <SidebarMenuSub className={`-mt-1 overflow-hidden pr-1 pl-3 transition-all duration-200`}>
          {lobbies.map((lobby) => (
            <SidebarLobbyItem key={lobby.id} lobby={lobby}>
              <SidebarMenuButton>{lobby.name}</SidebarMenuButton>
            </SidebarLobbyItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarContent>
  );
};
