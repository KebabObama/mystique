"use client";

import {
	ChevronDown,
	LogOut,
	Moon,
	Settings,
	SidebarIcon,
	Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import * as Sidebar from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";

export default () => {
	const { setTheme, resolvedTheme } = useTheme();
	const { toggleSidebar, open } = Sidebar.useSidebar();
	const { data } = authClient.useSession();
	const [show, setShow] = useState(false);
	const router = useRouter();
	const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
	const isDark = resolvedTheme === "dark";

	return (
		<Sidebar.Sidebar
			variant="floating"
			collapsible="icon"
			className="bg-card relative my-4 ml-4 h-[calc(100dvh-2rem)] p-0"
		>
			<Border />
			<Sidebar.SidebarHeader className="flex flex-col items-center justify-start">
				<Sidebar.SidebarMenuButton onClick={toggleSidebar}>
					<SidebarIcon />
					<span className="truncate overflow-hidden" hidden={!open}>
						Open Sidebar
					</span>
				</Sidebar.SidebarMenuButton>
			</Sidebar.SidebarHeader>
			<div className="bg-foreground dark:bg-ring -mx-0.5 h-1.5 w-[calc(100%+0.25rem)]" />
			<Sidebar.SidebarContent></Sidebar.SidebarContent>
			<Sidebar.SidebarFooter>
				{show && (
					<div className="relative m-2 flex flex-col">
						<Border />
						<Link href="/settings">
							<Sidebar.SidebarMenuButton>
								<Settings />
								Settings
							</Sidebar.SidebarMenuButton>
						</Link>
						<Sidebar.SidebarMenuButton onClick={toggleTheme}>
							<Sun
								className={`transition-all duration-500 ${isDark ? "rotate-180 opacity-0" : "rotate-0 opacity-100"} `}
							/>
							<Moon
								className={`absolute transition-all duration-500 ${isDark ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}
							/>
							{isDark ? "Light theme" : "Dark theme"}
						</Sidebar.SidebarMenuButton>
						<Sidebar.SidebarMenuButton
							variant={"destructive"}
							onClick={() => {
								authClient.signOut();
								router.replace("/");
							}}
						>
							<LogOut />
							<span>Sign Out</span>
						</Sidebar.SidebarMenuButton>
					</div>
				)}
				<Sidebar.SidebarMenuButton
					className="my-2 flex cursor-pointer flex-row gap-6 overflow-visible transition-transform duration-200"
					onClick={() => setShow(!show)}
				>
					<Avatar className="size-8 overflow-visible">
						<AvatarImage src={data?.user?.image as string} />
						<AvatarFallback />
					</Avatar>
					<span className="flex w-full flex-row justify-between text-lg">
						{data?.user?.name || "User"}
						<ChevronDown
							className={`transition-all duration-200 ${show ? "rotate-180" : "rotate-0"}`}
						/>
					</span>
				</Sidebar.SidebarMenuButton>
			</Sidebar.SidebarFooter>
		</Sidebar.Sidebar>
	);
};
