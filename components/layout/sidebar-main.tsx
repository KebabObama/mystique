"use client";

import { Badge } from "@/components/ui/badge";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLobby } from "@/lib/hooks/use-lobby";
import { useUser } from "@/lib/hooks/use-user";
import { getUnreadCount } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { LobbyCreate } from "./lobby-create";
import { LobbyJoin } from "./lobby-join";
import { SidebarLobbyItem } from "./sidebar-lobby-item";

export const SidebarMain = () => {
  const { lobbies } = useLobby();
  const userId = useUser((s) => s?.id);
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
        <LobbyJoin />
        <LobbyCreate />
        {!open && (
          <>
            <div className="mt-auto"></div>
            {lobbies.map((lobby) => (
              <SidebarLobbyItem lobby={lobby} key={lobby.id}>
                <SidebarMenuButton className="relative ml-1.5 text-center text-lg capitalize">
                  <span>{lobby.name[0]}</span>
                  {userId && getUnreadCount(lobby, userId) > 0 && (
                    <Badge className="absolute top-0 right-0 size-2 rounded-full p-0" />
                  )}
                </SidebarMenuButton>
              </SidebarLobbyItem>
            ))}
          </>
        )}
      </SidebarMenu>
      {open && !!lobbies.length && (
        <SidebarMenuSub className={`-mt-1 overflow-hidden pr-1 pl-3 transition-all duration-200`}>
          {lobbies.map((lobby) => (
            <SidebarLobbyItem key={lobby.id} lobby={lobby}>
              <SidebarMenuButton className="relative">
                <span className="flex-1">{lobby.name}</span>
                {userId && getUnreadCount(lobby, userId) > 0 && (
                  <Badge variant="default" className="ml-2 px-1.5 py-0.5 text-xs">
                    {getUnreadCount(lobby, userId)}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarLobbyItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarContent>
  );
};
