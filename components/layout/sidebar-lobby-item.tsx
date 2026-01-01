"use client";

import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@/hooks/use-user";
import { Lobby } from "@/lib/lobby";
import { Text } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { useSidebar } from "../ui/sidebar";

export const SidebarLobbyItem = ({ lobby }: { lobby: Lobby.Type }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const user = useUser();
  const sendMessage = useLobby((state) => state.sendMessage);
  const { open } = useSidebar();

  const send = () => {
    const input = inputRef.current;
    if (input && input.value.trim().length > 0) {
      sendMessage(lobby.id, input.value);
      input.value = "";
    }
    input?.focus();
  };

  const getDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`;
  };

  return (
    <div className="flex flex-row items-center gap-3">
      <Link
        href={`/game/${lobby.id}`}
        className={`text-foreground hover:text-muted ml-0.75 grow truncate transition-all duration-300 ${
          !open
            ? "max-w-[1ch] overflow-hidden text-xl whitespace-nowrap"
            : "max-w-full text-[.9rem]"
        }`}
      >
        {lobby.name}
      </Link>

      <Dialog fullscreen>
        <Dialog.Trigger>
          <Text className="text-foreground hover:text-muted size-4 transition-all duration-300" />
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>{lobby.name}</Dialog.Title>
          <Dialog.Description>{lobby.id}</Dialog.Description>
          <div className="flex h-full w-full flex-col gap-2 overflow-y-auto">
            {lobby.messages.map((e) => (
              <div
                key={e.id}
                className={`group flex w-full justify-between gap-1 ${
                  user.id === e.senderId ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <span className="text-muted group-hover:text-foreground flex w-1/5 flex-col truncate overflow-hidden text-xs">
                  <span>{lobby.members.find((f) => f.id === e.senderId)?.name}</span>
                  <span>{getDate(e.createdAt)}</span>
                </span>
                <span className={`${user.id === e.senderId ? "text-end" : "text-start"} grow`}>
                  {e.content}
                </span>
              </div>
            ))}
          </div>
          <Dialog.Footer>
            <Input
              ref={inputRef}
              type="text"
              className="grow"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button onClick={send}>Send</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

