import Sidebar from "@/components/layout/sidebar-app";
import { CommunicationProvider } from "@/components/providers/comms-provider";
import { UserStoreProvider } from "@/components/providers/user-store-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default ({ children }: { children: React.ReactNode }) => {
	return (
		<UserStoreProvider>
			<CommunicationProvider>
				<SidebarProvider className="h-dvh w-dvw overflow-hidden">
					<Sidebar />
					<main className="relative h-full w-full">{children}</main>
					<Toaster />
				</SidebarProvider>
			</CommunicationProvider>
		</UserStoreProvider>
	);
};
