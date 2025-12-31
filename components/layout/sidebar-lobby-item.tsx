"use client";

import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@/hooks/use-user";
import { Lobby } from "@/lib/lobby";
import { Play, Text } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Border } from "../ui/border";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import * as Sidebar from "../ui/sidebar";

export const SidebarLobbyItem = ({ lobby }: { lobby: Lobby.Type }) => {
  const [message, setMessage] = React.useState("");
  const user = useUser();
  const sendMessage = useLobby((state) => state.sendMessage);

  const getDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getMonth()}.${d.getDay()}.${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`;
  };

  return (
    <Sidebar.SidebarMenuSubItem className="flex flex-row items-center gap-1.5">
      {lobby.name}
      <Link href={`/game/${lobby.id}`} className="ml-auto">
        <Play className="ml-auto size-4" />
      </Link>
      <Dialog fullscreen>
        <Dialog.Trigger>
          <Text className="size-4" />
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>{lobby.name}</Dialog.Title>
          <Dialog.Description>{lobby.id}</Dialog.Description>
          <div className="flex h-full w-full flex-col gap-6">
            {lobby.messages.map((e) => (
              <div
                key={e.id}
                className={`group flex w-full justify-between gap-1 ${user.id !== e.senderId ? "flex-row-reverse" : "flex-row"}`}
              >
                <span className="text-muted group-hover:text-foreground flex flex-col overflow-hidden text-xs">
                  <span>{lobby.members.find((f) => f.id === e.senderId)?.name}</span>
                  <span>{getDate(e.createdAt)}</span>
                </span>
                <span
                  className={`bg-background relative w-fit max-w-1/2 px-3 opacity-70 group-hover:opacity-100`}
                  key={e.id}
                >
                  <Border />
                  {e.content}
                </span>
              </div>
            ))}
          </div>
          <Dialog.Footer>
            <Input
              type="text"
              className="grow"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={() => sendMessage(lobby.id, message)}>Send message</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </Sidebar.SidebarMenuSubItem>
  );
};

