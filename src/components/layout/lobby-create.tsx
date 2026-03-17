"use client";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useLobby } from "@/hooks/use-lobby";
import { Plus } from "lucide-react";
import React from "react";
import { LobbyActionDialog } from "./lobby-action-dialog";

/** Renders the lobby create component. */
export const LobbyCreate = ({ sidebar = true }: { sidebar?: boolean }) => {
  const createLobby = useLobby((s) => s.createLobby);
  const [name, setName] = React.useState("");
  const disabled = name.length === 0;
  const trigger = sidebar ? (
    <SidebarMenuButton className="flex items-center truncate text-lg">
      <Plus />
      Create lobby
    </SidebarMenuButton>
  ) : (
    <Button className="w-full">
      <Plus /> Lobby
    </Button>
  );

  return (
    <LobbyActionDialog
      description="Want to play or just want to text? Create lobby and see."
      disabled={disabled}
      onSubmit={createLobby}
      onValueChange={setName}
      placeholder="Lobby name"
      submitLabel="Create"
      title="Create new lobby"
      trigger={trigger}
      value={name}
    />
  );
};
