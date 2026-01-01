"use client";

import { useLobby } from "@/hooks/use-lobby";
import { Ampersand } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { SidebarMenuButton } from "../ui/sidebar";

export const JoinLobby = () => {
  const joinLobby = useLobby((s) => s.joinLobby);
  const [code, setCode] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);
  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <Dialog.Trigger asChild>
        <SidebarMenuButton className="flex items-center truncate text-lg">
          <Ampersand />
          Join lobby
        </SidebarMenuButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Join new lobby</Dialog.Title>
        <Dialog.Description>
          Want to play or just want to text? Join lobby and see.
        </Dialog.Description>
        <Input value={code} onChange={(e) => setCode(e.target.value)} />
        <Dialog.Footer>
          <Button
            type="submit"
            disabled={!isUuid}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              joinLobby(code);
              setOpen(!open);
              setCode("");
            }}
          >
            Create
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

