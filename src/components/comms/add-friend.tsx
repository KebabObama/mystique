"use client";

import { Copy, UserPlus } from "lucide-react";
import React from "react";
import { useCommunication } from "@/components/providers/comms-provider";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/hooks/use-user-store";
import { toast } from "../layout/toast";
import { Border } from "../ui/border";

export const AddFriendSection = () => {
	const { sendFriendRequest } = useCommunication();
	const currentUserId = useUserStore((state) => state.user?.id);
	const [friendInput, setFriendInput] = React.useState<string>("");

	const handleAddFriend = React.useCallback(() => {
		const trimmed = friendInput.trim();
		if (!trimmed) return;
		sendFriendRequest(trimmed);
		setFriendInput("");
		toast.success("Friend request sent!");
	}, [friendInput, sendFriendRequest]);

	const handleCopyId = React.useCallback(() => {
		if (!currentUserId) return;
		navigator.clipboard
			.writeText(currentUserId)
			.then(() => toast("ID copied to clipboard!"))
			.catch(() => toast.error("Failed to copy ID"));
	}, [currentUserId]);

	if (!currentUserId) return null;

	return (
		<Card>
			<Card.Header>
				<Card.Title className="flex items-center gap-2">
					<UserPlus className="size-5" />
					Add Friend
				</Card.Title>
			</Card.Header>
			<Card.Content className="flex flex-col gap-6">
				<div className="flex gap-6 w-full">
					<Input
						className="w-full"
						value={friendInput}
						onChange={(e) => setFriendInput(e.target.value)}
						placeholder="Enter friend's user ID"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAddFriend();
							}
						}}
					/>
					<Button className="w-auto" onClick={handleAddFriend}>
						<UserPlus />
						Send
					</Button>
				</div>
				<div className="flex items-center gap-2 p-3 relative">
					<Border />
					<div className="flex-1">
						<p className="text-xs text-muted-foreground mb-1">Your User ID</p>
						<code className="text-sm font-mono">{currentUserId}</code>
					</div>
					<Button variant="outline" size="sm" onClick={handleCopyId}>
						<Copy className="size-4 mr-2" />
						Copy
					</Button>
				</div>
			</Card.Content>
		</Card>
	);
};
