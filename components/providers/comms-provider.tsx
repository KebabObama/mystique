"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { io, type Socket } from "socket.io-client";
import type * as schema from "@/db/schema";
import { useUserStore } from "@/stores/user-store";
import { toast } from "../layout/toast";

// Simplified types
type FriendRequest = typeof schema.friendRequest.$inferSelect & {
	senderName?: string;
	senderEmail?: string;
	senderImage?: string | null;
};

type Friend = typeof schema.user.$inferSelect & { friendship: string };
type Group = typeof schema.group.$inferSelect;
type Message = typeof schema.message.$inferSelect;

type CommunicationState = {
	requests: FriendRequest[];
	friends: Friend[];
	groups: Group[];
	messages: Message[];
	socket: Socket | null;
};

type CommunicationActions = {
	sendMessage: (text: string, linkId: string, isGroup?: boolean) => void;
	sendFriendRequest: (receiverId: string) => void;
	acceptRequest: (senderId: string) => void;
	denyRequest: (senderId: string) => void;
	removeFriend: (friendId: string) => void;
	blockUser: (userId: string) => void;
	createGroup: (name: string, userIds: string[]) => void;
};

type CommunicationContextValue = CommunicationState & CommunicationActions;

const CommunicationContext = createContext<CommunicationContextValue | null>(
	null,
);

export const CommunicationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const userId = useUserStore((state) => state.userId);
	const socketRef = useRef<Socket | null>(null);
	const [requests, setRequests] = useState<FriendRequest[]>([]);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [groups, setGroups] = useState<Group[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (!userId || socketRef.current) return;

		const socket = io(process.env.NEXT_PUBLIC_COMMS_SOCKET_URL as string, {
			transports: ["websocket"],
			withCredentials: true,
		});
		socketRef.current = socket;

		socket.on("connect", () => {
			console.log("✅ connected to socket");
			socket.emit("join-room", userId);
		});

		socket.on("disconnect", () => console.log("🔌 disconnected"));

		socket.on(
			"initial-data",
			(data: {
				friends: Friend[];
				requests: FriendRequest[];
				messages: Message[];
				groups: Group[];
			}) => {
				console.log("📦 Received initial data:", data);
				setFriends(data.friends);
				setRequests(data.requests);
				setMessages(data.messages);
				setGroups(data.groups);
			},
		);

		socket.on(
			"friend:request:received",
			(data: {
				sender: string;
				receiver: string;
				senderName: string;
				senderEmail: string;
				senderImage: string | null;
			}) => {
				setRequests((prev) => [...prev, data as FriendRequest]);
			},
		);

		socket.on("friend:accepted", (friendData: Friend) => {
			console.log("✅ Friend accepted:", friendData);
			setFriends((prev) => [...prev, friendData]);
			setRequests((prev) => prev.filter((r) => r.sender !== friendData.id));
		});

		socket.on("friend:denied", ({ userId: uid }: { userId: string }) => {
			setRequests((prev) => prev.filter((r) => r.sender !== uid));
		});

		socket.on("friend:removed", ({ friendId }: { friendId: string }) => {
			setFriends((prev) => prev.filter((f) => f.id !== friendId));
		});

		socket.on("user:blocked", ({ userId: uid }: { userId: string }) => {
			setFriends((prev) => prev.filter((f) => f.id !== uid));
		});

		socket.on("group:created", (group: Group) => {
			setGroups((prev) => [...prev, group]);
		});

		socket.on("message:new", (msg: Message) => {
			setMessages((prev) => [...prev, msg]);
			toast(msg.text);
		});

		return () => {
			socket.disconnect();
			socketRef.current = null;
		};
	}, [userId]);

	const sendMessage = useCallback(
		(text: string, linkId: string, isGroup = false) => {
			if (!userId) return;

			const tempMessage: Message = {
				id: `temp-${Date.now()}`,
				link: linkId,
				isGroup,
				sender: userId,
				text,
				createdAt: new Date(),
			};

			setMessages((prev) => [...prev, tempMessage]);

			socketRef.current?.emit("message:send", {
				senderId: userId,
				linkId,
				text,
				isGroup,
			});
		},
		[userId],
	);

	const sendFriendRequest = useCallback(
		(receiverId: string) => {
			if (!userId) return;
			socketRef.current?.emit("friend:send", {
				senderId: userId,
				receiverId,
			});
		},
		[userId],
	);

	const acceptRequest = useCallback(
		(senderId: string) => {
			if (!userId) return;
			socketRef.current?.emit("friend:accept", {
				senderId,
				receiverId: userId,
			});
		},
		[userId],
	);

	const denyRequest = useCallback(
		(senderId: string) => {
			if (!userId) return;
			socketRef.current?.emit("friend:deny", {
				senderId,
				receiverId: userId,
			});
		},
		[userId],
	);

	const removeFriend = useCallback(
		(friendId: string) => {
			if (!userId) return;
			socketRef.current?.emit("friend:remove", {
				userId,
				friendId,
			});
		},
		[userId],
	);

	const blockUser = useCallback(
		(blockedUserId: string) => {
			if (!userId) return;
			socketRef.current?.emit("user:block", {
				userId,
				blockedUserId,
			});
		},
		[userId],
	);

	const createGroup = useCallback(
		(name: string, userIds: string[]) => {
			if (!userId) return;
			socketRef.current?.emit("group:create", {
				creatorId: userId,
				userIds,
				name,
			});
		},
		[userId],
	);

	return (
		<CommunicationContext.Provider
			value={{
				socket: socketRef.current,
				requests,
				friends,
				groups,
				messages,
				sendMessage,
				sendFriendRequest,
				acceptRequest,
				denyRequest,
				removeFriend,
				blockUser,
				createGroup,
			}}
		>
			{children}
		</CommunicationContext.Provider>
	);
};

export const useCommunication = () => {
	const ctx = useContext(CommunicationContext);
	if (!ctx)
		throw new Error(
			"useCommunication must be used within CommunicationProvider",
		);
	return ctx;
};

export type { Friend, FriendRequest, Group, Message };
