"use client";

import type { User } from "better-auth";
import { Send } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { FriendData } from "./friends-provider";
import { useMessages } from "./message-provider";

export default ({
	user,
	friends,
	className,
}: {
	user: User;
	friends: { id: FriendData["id"]; name: FriendData["name"] }[];
	className?: string;
}) => {
	const { messages, sendMessage } = useMessages();
	const [text, setText] = React.useState("");
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const data = messages.filter(
		(m) =>
			m.users.includes(user.id) &&
			m.users.every(
				(uid) => uid === user.id || friends.map((f) => f.id).includes(uid),
			),
	);

	useEffect(() => {
		if (textareaRef.current)
			textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
	}, []);

	return (
		<section className={cn("flex w-full flex-col gap-4", className)}>
			<Textarea
				ref={textareaRef}
				className="max-h-52 min-h-32 resize-y"
				disabled
				readOnly
				value={data
					.map((m) => `${m.data.sender.name}: ${m.data.text}`)
					.join("\n")}
			/>
			<div className="flex flex-wrap gap-4">
				<Input
					type="text"
					placeholder="Type a message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="min-w-24 grow"
				/>
				<Button
					disabled={!text}
					onClick={() => {
						if (!text) return;
						sendMessage({
							sender: { id: user.id, name: user.name },
							text,
							users: [user.id, ...friends.map((f) => f.id)],
						});
						setText("");
					}}
					className="w-auto grow-0"
				>
					<Send />
				</Button>
			</div>
		</section>
	);
};
