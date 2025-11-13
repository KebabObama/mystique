"use client";

import { Ban, Info, Send, UserMinus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useUserStore } from "@/hooks/use-user-store";
import { cn } from "@/lib/utils";
import { type Friend, useCommunication } from "../providers/comms-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";
import Dialog from "../ui/dialog";
import { Input } from "../ui/input";
import { FriendSlot } from "./friend-slot";

type FriendDialogProps = {
	friend: Friend;
};

const FriendDialog = ({ friend }: FriendDialogProps) => {
	const [msg, setMsg] = React.useState("");
	const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);
	const [showConfirmBlock, setShowConfirmBlock] = React.useState(false);
	const { sendMessage, messages, removeFriend, blockUser } = useCommunication();
	const user = useUserStore((state) => state.user);

	const filteredMessages = React.useMemo(
		() =>
			messages.filter(
				(m) =>
					(m.sender === user?.id && m.link === friend.id) ||
					(m.sender === friend.id && m.link === user?.id),
			),
		[messages, user, friend.id],
	);

	const handleSendMessage = React.useCallback(() => {
		if (!msg.trim() || !user?.id) return;
		sendMessage(msg, friend.id);
		setMsg("");
	}, [msg, sendMessage, friend.id, user]);

	const handleRemoveFriend = React.useCallback(() => {
		removeFriend(friend.id);
		setShowConfirmRemove(false);
		toast.success(`Removed ${friend.name} from friends`);
	}, [removeFriend, friend.id, friend.name]);

	const handleBlockUser = React.useCallback(() => {
		blockUser(friend.id);
		setShowConfirmBlock(false);
		toast.success(`Blocked ${friend.name}`);
	}, [blockUser, friend.id, friend.name]);

	if (!user?.id) return null;

	return (
		<Dialog.Content className="max-w-2xl">
			<Dialog.Header className="mb-1">
				<Dialog.Title className="flex items-center gap-3">
					<Avatar className="size-12">
						<AvatarImage src={friend.image || undefined} />
						<AvatarFallback>
							{friend.name?.charAt(0).toUpperCase() || "?"}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="text-lg">{friend.name}</span>
						<span className="text-sm text-muted-foreground font-normal">
							{friend.email}
						</span>
					</div>
				</Dialog.Title>
			</Dialog.Header>

			<div className="flex flex-col gap-6">
				<div className="overflow-show border rounded-lg bg-muted/20 relative">
					<Border />
					<div className="flex flex-col w-full gap-2 overflow-y-auto h-full p-4 max-h-96 min-h-20 resize-y items-center">
						{filteredMessages.map((m) => (
							<div
								key={m.id}
								className={cn(
									"flex w-full gap-2 justify-between group",
									m.sender === user?.id ? "flex-row-reverse" : "flex-row",
								)}
							>
								<div
									className={cn(
										"text-sm py-1 px-4  rounded-lg max-w-[75%] wrap-break-word",
										m.sender === user?.id
											? "bg-background text-primary-foreground"
											: "bg-background border",
									)}
								>
									{m.text}
								</div>
								<div className="flex flex-col gap-0 group-hover:scale-80 opacity-0 scale-0 transition-all duration-300 group-hover:opacity-100">
									<span className="text-xs">
										{m.sender === user?.id ? user?.name || "You" : friend.name}
									</span>
									<span className="text-xs">
										{new Date(m.createdAt as Date).toLocaleTimeString()}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="flex gap-6">
					<Input
						placeholder="Type a message..."
						className="w-full"
						value={msg}
						onChange={(e) => setMsg(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSendMessage();
							}
						}}
					/>
					<Button onClick={handleSendMessage} size="icon">
						<Send className="size-4" />
					</Button>
				</div>

				<div className="flex flex-col gap-3 pt-4 border-t">
					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
						<Info className="size-4" />
						<span>Friend Actions</span>
					</div>
					<div className="flex gap-3">
						{showConfirmRemove ? (
							<div className="flex items-center gap-2 flex-1">
								<span className="text-sm text-muted-foreground">
									Remove {friend.name}?
								</span>
								<Button
									variant="destructive"
									size="sm"
									onClick={handleRemoveFriend}
								>
									Confirm
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowConfirmRemove(false)}
								>
									Cancel
								</Button>
							</div>
						) : (
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => setShowConfirmRemove(true)}
							>
								<UserMinus className="size-4 mr-2" />
								Remove Friend
							</Button>
						)}

						{showConfirmBlock ? (
							<div className="flex items-center gap-6 flex-1">
								<span className="text-sm text-muted-foreground">
									Block {friend.name}?
								</span>
								<Button
									variant="destructive"
									size="sm"
									onClick={handleBlockUser}
								>
									Confirm
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowConfirmBlock(false)}
								>
									Cancel
								</Button>
							</div>
						) : (
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => setShowConfirmBlock(true)}
							>
								<Ban className="size-4 mr-2" />
								Block User
							</Button>
						)}
					</div>
				</div>
			</div>
		</Dialog.Content>
	);
};

export const FriendsListSection = () => {
	const { friends } = useCommunication();

	return (
		<Card className="w-full">
			<Card.Header>
				<Card.Title>Friends</Card.Title>
			</Card.Header>
			<Card.Content className="flex flex-col gap-6 items-center justify-center w-full">
				{!friends.length && (
					<p className="text-sm text-muted-foreground">No requests yet</p>
				)}
				{friends.map((f) => (
					<Dialog key={f.id}>
						<Dialog.Trigger className="w-full">
							<FriendSlot image={f.image} name={f.name} />
						</Dialog.Trigger>
						<FriendDialog friend={f} />
					</Dialog>
				))}
			</Card.Content>
		</Card>
	);
};
