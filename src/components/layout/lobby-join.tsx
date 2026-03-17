"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useLobby } from "@/hooks/use-lobby";
import { Ampersand } from "lucide-react";
import React from "react";
import { LobbyActionDialog } from "./lobby-action-dialog";

/** Renders the lobby join component. */
export const LobbyJoin = () => {
  const joinLobby = useLobby((s) => s.joinLobby);
  const [code, setCode] = React.useState("");
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);

  return (
    <LobbyActionDialog
      description="Want to play or just want to text? Join lobby and see."
      disabled={!isUuid}
      onSubmit={joinLobby}
      onValueChange={setCode}
      placeholder="Lobby ID"
      submitLabel="Join"
      title="Join new lobby"
      trigger={
        <SidebarMenuButton className="flex items-center truncate text-lg">
          <Ampersand />
          Join lobby
        </SidebarMenuButton>
      }
      value={code}
    />
  );
};
