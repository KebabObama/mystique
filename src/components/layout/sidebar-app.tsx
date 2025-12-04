"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  SidebarIcon,
  Sun,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import * as Sidebar from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";

export default () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { toggleSidebar } = Sidebar.useSidebar();
  const user = useUser();
  const [show, setShow] = useState(false);
  const router = useRouter();
  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const isDark = resolvedTheme === "dark";

  return (
    <Sidebar.Sidebar
      className="bg-card relative my-4 ml-4 h-[calc(100dvh-2rem)] p-0"
      collapsible="icon"
      variant="floating">
      <Border />
      <Sidebar.SidebarHeader className="border-foreground dark:border-ring -mx-0.5 hidden flex-col items-center justify-start gap-2 border-b-6 md:flex">
        <Sidebar.SidebarMenuButton onClick={toggleSidebar}>
          <SidebarIcon />
          Toggle Sidebar
        </Sidebar.SidebarMenuButton>
      </Sidebar.SidebarHeader>
      <Sidebar.SidebarContent>
        <Sidebar.SidebarMenu className="flex-col items-center justify-start gap-2 p-2 md:flex">
          <Sidebar.SidebarMenuButton onClick={() => router.push("/dashboard")}>
            <LayoutDashboard />
            Dashboard
          </Sidebar.SidebarMenuButton>
          <Sidebar.SidebarMenuButton onClick={() => router.push("/friends")}>
            <Users />
            Friends
          </Sidebar.SidebarMenuButton>
        </Sidebar.SidebarMenu>
      </Sidebar.SidebarContent>
      <Sidebar.SidebarFooter>
        {show && (
          <div className="relative m-2 flex flex-col">
            <Border />
            <Link href="/settings">
              <Sidebar.SidebarMenuButton className="truncate">
                <Settings />
                Settings
              </Sidebar.SidebarMenuButton>
            </Link>
            <Sidebar.SidebarMenuButton
              className="truncate"
              onClick={toggleTheme}>
              <Sun
                className={`transition-all duration-500 ${isDark ? "rotate-180 opacity-0" : "rotate-0 opacity-100"} `}
              />
              <Moon
                className={`absolute transition-all duration-500 ${isDark ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}
              />
              {isDark ? "Light theme" : "Dark theme"}
            </Sidebar.SidebarMenuButton>
            <Sidebar.SidebarMenuButton
              className="truncate"
              onClick={() => {
                authClient.signOut();
                router.replace("/");
              }}
              variant={"destructive"}>
              <LogOut />
              <span>Sign Out</span>
            </Sidebar.SidebarMenuButton>
          </div>
        )}
        <Sidebar.SidebarMenuButton
          className="my-1.5 flex cursor-pointer flex-row gap-6 overflow-visible transition-transform duration-200"
          onClick={() => setShow(!show)}>
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
      </Sidebar.SidebarFooter>
    </Sidebar.Sidebar>
  );
};
