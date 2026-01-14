"use client";

import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@/hooks/use-user";
import { Lobby } from "@/lib/lobby";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Code, Delete, Play, Send, Text, Users } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { Border } from "../ui/border";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "./toast";

export const SidebarLobbyItem = ({
  children,
  lobby,
}: {
  lobby: Lobby.Type;
  readonly children: React.ReactNode;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const user = useUser();
  const sendMessage = useLobby((s) => s.sendMessage);
  const leaveLobby = useLobby((s) => s.leaveLobby);
  const [isUserList, setIsUserList] = React.useState(false);

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
    <Dialog fullscreen>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{lobby.name}</Dialog.Title>
        <Dialog.Description>{lobby.id}</Dialog.Description>
        {isUserList ? (
          <div className="flex h-full w-full flex-col gap-7.5 overflow-y-auto px-1.5 py-6">
            {lobby.members.map((member) => (
              <Card
                key={member.id}
                className="group flex h-18 items-center justify-between gap-6 p-0 odd:flex-row even:flex-row-reverse"
              >
                <Avatar className="bg-border relative z-50 size-24">
                  <AvatarImage src={member.image || ""} />
                  <Border />
                </Avatar>
                <div className="flex flex-col p-3 group-odd:text-end group-even:text-start">
                  <span>{member.name}</span>
                  <span className="text-muted">{member.email}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col gap-2 overflow-y-auto">
            {lobby.messages.map((e) => (
              <div
                key={e.id}
                className={`flex w-full justify-between gap-1 ${user.id === e.senderId ? "flex-row" : "flex-row-reverse"}`}
              >
                <span
                  className={`text-muted/90 flex w-1/5 flex-col truncate overflow-hidden text-xs ${user.id !== e.senderId ? "text-end" : "text-start"}`}
                >
                  <span>{lobby.members.find((f) => f.id === e.senderId)?.name}</span>
                  <span>{getDate(e.createdAt)}</span>
                </span>
                <span className={`${user.id === e.senderId ? "text-end" : "text-start"} grow`}>
                  {e.content}
                </span>
              </div>
            ))}
          </div>
        )}
        <Dialog.Footer className="h-fit">
          <div className="flex h-fit w-full flex-col gap-6">
            <Input
              ref={inputRef}
              type="text"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <div className="grid grid-cols-5 gap-6">
              <Button onClick={send}>
                <Send />
                Send
              </Button>
              <Button onClick={() => redirect(`/game/${lobby.id}`)}>
                <Play />
                Play
              </Button>
              <Button
                className="group"
                onClick={() => {
                  navigator.clipboard.writeText(lobby.id);
                  toast.show("Code to lobby copied!");
                }}
              >
                <Code className="transition-all duration-150 group-active:rotate-180" />
                Code
              </Button>
              <Button onClick={() => setIsUserList((p) => !p)}>
                {!isUserList ? (
                  <>
                    <Users />
                    Members
                  </>
                ) : (
                  <>
                    <Text />
                    Messages
                  </>
                )}
              </Button>
              <Button variant={"destructive"} onClick={() => leaveLobby(lobby.id)}>
                <Delete />
                Leave
              </Button>
            </div>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
