"use client";

import * as Sidebar from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/utils";
import { ChevronDown, LogOut, Moon, Settings, SidebarIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";
import { SidebarMain } from "./sidebar-main";

export const SidebarApp = () => {
  const { toggleSidebar } = Sidebar.useSidebar();
  const [show, setShow] = useState(false);

  return (
    <Sidebar.Sidebar
      className="bg-card relative my-4 ml-4 h-[calc(100dvh-2rem)] p-0 text-lg"
      collapsible="icon"
      variant="floating"
    >
      <Border />
      <SidebarHeader onToggle={toggleSidebar} />
      <SidebarMain />
      <Sidebar.SidebarFooter>
        {show && <UserMenu />}
        <UserToggle show={show} onClick={() => setShow(!show)} />
      </Sidebar.SidebarFooter>
    </Sidebar.Sidebar>
  );
};

export const UserMenu = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const isDark = resolvedTheme === "dark";
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
          redirect("/");
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

export const SidebarHeader = ({ onToggle }: { onToggle: () => void }) => (
  <Sidebar.SidebarHeader className="-mx-0.5 hidden flex-col items-center justify-start gap-2 border-b-6 md:flex">
    <Sidebar.SidebarMenuButton onClick={onToggle} className="truncate text-lg">
      <SidebarIcon />
      Toggle Sidebar
    </Sidebar.SidebarMenuButton>
  </Sidebar.SidebarHeader>
);
