"use client";

import { useLobby } from "@/hooks/use-lobby";
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { SidebarMenuButton } from "../ui/sidebar";

export const CreateLobby = () => {
  const createLobby = useLobby((s) => s.createLobby);
  const [name, setName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const disabled = name.length === 0;

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <Dialog.Trigger asChild>
        <SidebarMenuButton className="flex items-center truncate text-lg">
          <Plus />
          Create lobby
        </SidebarMenuButton>
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
