"use client";

import * as Sidebar from "@/components/ui/sidebar";
import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@/hooks/use-user";
import { Lobby } from "@/lib/lobby";
import { authClient } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Moon,
  Play,
  Plus,
  Settings,
  SidebarIcon,
  Sun,
  Text,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";

export const SidebarApp = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { toggleSidebar } = Sidebar.useSidebar();
  const [show, setShow] = useState(false);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const isDark = resolvedTheme === "dark";

  return (
    <Sidebar.Sidebar
      className="bg-card relative my-4 ml-4 h-[calc(100dvh-2rem)] p-0 text-lg"
      collapsible="icon"
      variant="floating"
    >
      <Border />
      <SidebarAppHeader onToggle={toggleSidebar} />
      <SidebarAppNav />
      <Sidebar.SidebarFooter>
        {show && <UserMenu isDark={isDark} toggleTheme={toggleTheme} />}
        <UserToggle show={show} onClick={() => setShow(!show)} />
      </Sidebar.SidebarFooter>
    </Sidebar.Sidebar>
  );
};

export const UserMenu = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const router = useRouter();
  return (
    <div className="relative m-2 flex flex-col">
      <Border />
      <Link href="/settings">
        <Sidebar.SidebarMenuButton className="truncate text-lg">
          <Settings />
          Settings
        </Sidebar.SidebarMenuButton>
      </Link>
      <Sidebar.SidebarMenuButton onClick={toggleTheme} className="truncate text-lg">
        <Sun
          className={`transition-all duration-500 ${isDark ? "rotate-180 opacity-0" : "rotate-0 opacity-100"} `}
        />
        <Moon
          className={`absolute transition-all duration-500 ${isDark ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}
        />
        {isDark ? "Light theme" : "Dark theme"}
      </Sidebar.SidebarMenuButton>
      <Sidebar.SidebarMenuButton
        className="truncate text-lg"
        onClick={() => {
          authClient.signOut();
          router.replace("/");
        }}
        variant="destructive"
      >
        <LogOut />
        Sign Out
      </Sidebar.SidebarMenuButton>
    </div>
  );
};

export const UserToggle = ({ show, onClick }: { show: boolean; onClick: () => void }) => {
  const user = useUser();
  return (
    <Sidebar.SidebarMenuButton
      className="my-1.5 flex cursor-pointer flex-row gap-6 overflow-visible transition-transform duration-200"
      onClick={onClick}
    >
      <Avatar className="size-8 overflow-visible">
        +
        <AvatarImage src={user?.image as string} />
        <AvatarFallback />
      </Avatar>
      <span className="flex w-full flex-row justify-between text-lg">
        {user?.name || "User"}
        <ChevronDown
          className={`transition-all duration-200 ${show ? "rotate-180" : "rotate-0"}`}
        />
      </span>
    </Sidebar.SidebarMenuButton>
  );
};

export const SidebarAppNav = () => {
  const [open, setOpen] = React.useState(true);
  const { lobbies } = useLobby();
  const router = useRouter();
  return (
    <Sidebar.SidebarContent>
      <Sidebar.SidebarMenu className="mb-0 flex-col items-center justify-start gap-2 p-2 pb-0 md:flex">
        <Sidebar.SidebarMenuButton
          onClick={() => router.push("/dashboard")}
          className="truncate text-lg"
        >
          <LayoutDashboard />
          Dashboard
        </Sidebar.SidebarMenuButton>
        <Sidebar.SidebarMenuButton
          onClick={() => setOpen(!open)}
          className="justify-start truncate text-lg"
        >
          <Users />
          Lobbies
          <Plus className="hover:text-foreground ml-auto" />
          <ChevronDown
            className={`hover:text-foreground transition-all duration-200 ${open ? "" : "rotate-90"}`}
          />
        </Sidebar.SidebarMenuButton>
      </Sidebar.SidebarMenu>
      <Sidebar.SidebarMenuSub
        className={`-mt-1 overflow-hidden pl-3 transition-all duration-200 ${open ? "max-h-auto" : "max-h-0 py-0"}`}
      >
        {lobbies.map((lobby) => (
          <SidebarLobbyItem lobby={lobby} key={lobby.id} />
        ))}
      </Sidebar.SidebarMenuSub>
    </Sidebar.SidebarContent>
  );
};

const SidebarLobbyItem = ({ lobby }: { lobby: Lobby.Type }) => {
  const [message, setMessage] = React.useState("");
  const user = useUser();
  const sendMessage = useLobby((state) => state.sendMessage);

  const getDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getMonth()}.${d.getDay()}.${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`;
  };

  return (
    <Sidebar.SidebarMenuSubItem className="flex flex-row items-center gap-1.5">
      <span className="mr-auto">{lobby.name}</span>
      <Link href={`/game/${lobby.id}`}>
        <Play className="size-4" />
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
            <Button onClick={() => sendMessage(user.id, lobby.id, message)}>Send message</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </Sidebar.SidebarMenuSubItem>
  );
};

export const SidebarAppHeader = ({ onToggle }: { onToggle: () => void }) => (
  <Sidebar.SidebarHeader className="-mx-0.5 hidden flex-col items-center justify-start gap-2 border-b-6 md:flex">
    <Sidebar.SidebarMenuButton onClick={onToggle} className="truncate text-lg">
      <SidebarIcon />
      Toggle Sidebar
    </Sidebar.SidebarMenuButton>
  </Sidebar.SidebarHeader>
);
