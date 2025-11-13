"use client";

import { Users } from "lucide-react";
import { AddFriendSection } from "@/components/comms/add-friend";
import { FriendsListSection } from "@/components/comms/friend-list";
import { FriendRequestsSection } from "@/components/comms/friend-requests";
import { useUserStore } from "@/hooks/use-user-store";

export default function FriendsPage() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	if (!isAuthenticated)
		return (
			<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
				<Users className="size-16 mb-4 opacity-50" />
				<p className="text-lg">You must be signed in to use Friends.</p>
			</div>
		);

	return (
		<>
			<AddFriendSection />
			<div className="flex gap-6">
				<FriendsListSection />
				<FriendRequestsSection />
			</div>
		</>
	);
}
