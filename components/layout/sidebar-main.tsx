"use client";

import { useLobby } from "@/hooks/use-lobby";
import { ChevronDown, LayoutDashboard, Plus, Users } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "../ui/sidebar";
import { CreateLobby } from "./create-lobby";
import { SidebarLobbyItem } from "./sidebar-lobby-item";

export const SidebarMain = () => {
  const [open, setOpen] = React.useState(true);
  const { lobbies } = useLobby();

  return (
    <SidebarContent>
      <SidebarMenu className="mb-0 flex-col items-center justify-start gap-2 p-2 pb-0 md:flex">
        <SidebarMenuButton onClick={() => redirect("/dashboard")} className="truncate text-lg">
          <LayoutDashboard />
          Dashboard
        </SidebarMenuButton>
        <SidebarMenuItem className="flex items-center truncate text-lg">
          <Users />
          Lobbies
          <CreateLobby className="ml-auto">
            <Plus className="hover:text-muted ml-auto transition-all duration-200 hover:scale-110" />
          </CreateLobby>
          <button type="button" onClick={() => setOpen(!open)}>
            <ChevronDown
              className={`hover:text-muted transition-all duration-200 hover:scale-110 ${open ? "" : "rotate-90"}`}
            />
          </button>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenuSub
        className={`-mt-1 overflow-hidden pl-3 transition-all duration-200 ${open ? "max-h-auto" : "max-h-0 py-0"}`}
      >
        {lobbies.map((lobby) => (
          <SidebarLobbyItem lobby={lobby} key={lobby.id} />
        ))}
      </SidebarMenuSub>
    </SidebarContent>
  );
};

