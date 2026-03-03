"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useLobby } from "@/lib/hooks/use-lobby";
import { Plus } from "lucide-react";
import React from "react";

export const LobbyCreate = ({ sidebar = true }: { sidebar?: boolean }) => {
  const createLobby = useLobby((s) => s.createLobby);
  const [name, setName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const disabled = name.length === 0;

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <Dialog.Trigger asChild>
        {sidebar ? (
          <SidebarMenuButton className="flex items-center truncate text-lg">
            <Plus />
            Create lobby
          </SidebarMenuButton>
        ) : (
          <Button className="w-full">
            <Plus /> Lobby
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Create new lobby</Dialog.Title>
        <Dialog.Description>
          Want to play or just want to text? Create lobby and see.
        </Dialog.Description>
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              createLobby(name);
              setOpen(!open);
              setName("");
            }
          }}
        />
        <Dialog.Footer>
          <Button
            type="submit"
            disabled={disabled}
            onClick={() => {
              createLobby(name);
              setOpen(!open);
              setName("");
            }}
          >
            Create
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
