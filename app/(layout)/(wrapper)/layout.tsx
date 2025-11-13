import Card from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative h-dvh w-full overflow-x-hidden overflow-y-auto space-y-6 px-6 py-4">
			<Card>
				<Card.Content>
					<SidebarTrigger />
				</Card.Content>
			</Card>
			{children}
		</div>
	);
};
