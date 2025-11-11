"use client";

import type { User } from "better-auth";
import { LucideMessageCircle, MessageCircleOff, Trash } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Dialog from "../ui/dialog";
import Chat from "./chat";
import { useFriends } from "./friends-provider";

export default ({ user }: { user: User }) => {
	const [openDialog, setOpenDialog] = React.useState<Record<string, boolean>>(
		{},
	);
	const [showChat, setShowChat] = React.useState<Record<string, boolean>>({});
	const { friends, loading, denyRequest } = useFriends();

	const handleDialogChange = (id: string, value: boolean) => {
		setOpenDialog((prev) => ({ ...prev, [id]: value }));
		if (!value) {
			// Reset chat view when dialog closes
			setShowChat((prev) => ({ ...prev, [id]: false }));
		}
	};

	const handleChatToggle = (id: string) => {
		setShowChat((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	if (loading)
		return (
			<div className="text-muted-foreground text-center">
				Loading friends...
			</div>
		);
	if (friends.length === 0)
		return (
			<div className="text-muted-foreground text-center">
				No friends yet. Add some friends to get started!
			</div>
		);

	return (
		<ul className="flex w-full flex-col gap-6">
			{friends.map((f) => {
				return (
					<Dialog
						key={f.id}
						open={openDialog[f.id]}
						onOpenChange={(value) => handleDialogChange(f.id, value)}
					>
						<Dialog.Trigger asChild>
							<Button variant="default" size={"lg"} className="w-full">
								<Avatar>
									<AvatarImage src={f.image || undefined} />
									<AvatarFallback>
										{f.name?.charAt(0).toUpperCase() || "?"}
									</AvatarFallback>
								</Avatar>
								<span className="ml-2 truncate text-lg font-medium">
									{f.name}
								</span>
							</Button>
						</Dialog.Trigger>
						<Dialog.Content className="sm:max-w-[500px]">
							<Dialog.Header>
								<Dialog.Title>{f.name}</Dialog.Title>
							</Dialog.Header>

							<div
								className={`flex w-full flex-row flex-wrap items-center justify-start gap-4 ${showChat[f.id] ? "hidden" : ""}`}
							>
								<Avatar>
									<AvatarImage src={f.image || undefined} />
									<AvatarFallback>
										{f.name?.charAt(0).toUpperCase() || "?"}
									</AvatarFallback>
								</Avatar>
								<div className="w-auto overflow-hidden">
									<div className="xs:min-w-[60px] min-w-[50px] truncate text-sm font-semibold select-none">
										Name:
										<span
											className={`xs:text-sm xs:w-auto ml-1 w-full truncate text-xs font-medium wrap-break-word select-all`}
										>
											{f.name}
										</span>
									</div>
									<div className="xs:min-w-[60px] min-w-[50px] text-sm font-semibold select-none">
										Email:
										<span
											className={`xs:text-sm xs:w-auto ml-1 w-full truncate text-xs font-medium wrap-break-word select-all`}
										>
											{f.email}
										</span>
									</div>
									<div className="xs:min-w-[60px] min-w-[50px] text-sm font-semibold select-none">
										Bio:
										<span
											className={`xs:text-sm xs:w-auto ml-1 w-full text-xs font-medium wrap-break-word select-all ${f.bio?.length === 0 ? "text-muted-foreground" : ""}`}
										>
											{f.bio?.length === 0 ? "User has no bio" : f.bio}
										</span>
									</div>
								</div>
							</div>

							<Chat
								user={user}
								friends={[f]}
								className={showChat[f.id] ? "" : "hidden"}
							/>

							<div className="grid w-full grid-cols-[repeat(auto-fill,minmax(36px,1fr))] gap-6">
								<Button
									size="icon"
									className="w-full"
									onClick={() => handleChatToggle(f.id)}
								>
									{showChat[f.id] ? (
										<MessageCircleOff />
									) : (
										<LucideMessageCircle />
									)}{" "}
								</Button>
								<Button
									size="icon"
									className="w-full"
									variant={"destructive"}
									onClick={() => denyRequest(f.id)}
								>
									<Trash />
								</Button>
							</div>
						</Dialog.Content>
					</Dialog>
				);
			})}
		</ul>
	);
};
