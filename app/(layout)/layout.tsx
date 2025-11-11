import { FriendsProvider } from "@/components/friends/friends-provider";
import { MessageProvider } from "@/components/friends/message-provider";
import Sidebar from "@/components/layout/sidebar-app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default ({ children }: { children: React.ReactNode }) => {
	return (
		<FriendsProvider>
			<MessageProvider>
				<SidebarProvider className="h-dvh w-dvw overflow-hidden">
					<Sidebar />
					<main className="relative h-full w-full">{children}</main>
					<Toaster />
				</SidebarProvider>
			</MessageProvider>
		</FriendsProvider>
	);
};
