"use client";

import { Badge } from "@/components/ui/badge";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@/hooks/use-user";
import type { Lobby } from "@/lib/lobby";
import { getUnreadCount } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { LobbyCreate } from "./lobby-create";
import { LobbyJoin } from "./lobby-join";
import { SidebarLobbyItem } from "./sidebar-lobby-item";

type LobbyMenuEntryProps = { compact: boolean; lobby: Lobby; userId?: string | null };

const LobbyMenuEntry = ({ compact, lobby, userId }: LobbyMenuEntryProps) => {
  const unreadCount = userId ? getUnreadCount(lobby, userId) : 0;

  return (
    <SidebarLobbyItem lobby={lobby}>
      <SidebarMenuButton
        className={compact ? "relative ml-1.5 text-center text-lg capitalize" : "relative"}
      >
        {compact ? <span>{lobby.name[0]}</span> : <span className="flex-1">{lobby.name}</span>}
        {unreadCount > 0 &&
          (compact ? (
            <Badge className="absolute top-0 right-0 size-2 rounded-full p-0" />
          ) : (
            <Badge variant="default" className="ml-2 px-1.5 py-0.5 text-xs">
              {unreadCount}
            </Badge>
          ))}
      </SidebarMenuButton>
    </SidebarLobbyItem>
  );
};

/** Renders the sidebar main component. */
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
              <LobbyMenuEntry compact key={lobby.id} lobby={lobby} userId={userId} />
            ))}
          </>
        )}
      </SidebarMenu>
      {open && !!lobbies.length && (
        <SidebarMenuSub className={`-mt-1 overflow-hidden pr-1 pl-3 transition-all duration-200`}>
          {lobbies.map((lobby) => (
            <LobbyMenuEntry compact={false} key={lobby.id} lobby={lobby} userId={userId} />
          ))}
        </SidebarMenuSub>
      )}
    </SidebarContent>
  );
};
