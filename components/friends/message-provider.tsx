"use client";

import React from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "@/components/layout/toast";
import { authClient } from "@/lib/auth-client";
import type { Message } from "@/sockets/messages";

type MessageContextType = {
	messages: Message[];
	sendMessage: (
		message: Omit<Message["data"], "timestamp"> & { users: string[] },
	) => void;
	loadMessages: () => void;
	isConnected: boolean;
	read: Message[];
	setRead: (read: Message[]) => void;
};

const MessageContext = React.createContext<MessageContextType | undefined>(
	undefined,
);

export const MessageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const user = authClient.useSession().data?.user;
	const [read, setRead] = React.useState<Message[]>([]);
	const [messages, setMessages] = React.useState<Message[]>([]);
	const [isConnected, setIsConnected] = React.useState(false);
	const socketRef = React.useRef<Socket | null>(null);

	React.useEffect(() => {
		if (!user) return;
		const socket = io(process.env.NEXT_PUBLIC_MESSAGE_SOCKET_URL, {
			transports: ["websocket"],
		});

		socketRef.current = socket;

		socket.on("connect", () => {
			setIsConnected(true);
			socket.emit("join-room", user.id);
			socket.emit("get-messages", user.id);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		socket.on("message", (message: Message) => {
			setMessages((prev) => [...prev, message]);
			if (message.data.sender.id !== user.id)
				toast.show(`${message.data.sender.name}: ${message.data.text}`);
		});

		socket.on("connect_error", (_error) => {
			setIsConnected(false);
		});

		socket.on("get-messages", (msgs: Message[]) => {
			setMessages(msgs);
		});

		return () => {
			socket.disconnect();
			socketRef.current = null;
			setMessages([]);
			setIsConnected(false);
		};
	}, [user]);

	const sendMessage = (
		message: Omit<Message["data"], "timestamp"> & { users: string[] },
	) => {
		if (!socketRef.current || !isConnected) {
			console.error("Cannot send message: Socket not connected");
			return;
		}
		const messageWithTimestamp: Message = {
			users: message.users,
			data: { ...message, timestamp: new Date().toISOString() },
		};
		socketRef.current.emit("message", messageWithTimestamp);
	};

	const loadMessages = () => {
		if (!socketRef.current || !isConnected || !user) {
			console.error("Cannot load messages: Socket not connected");
			return;
		}
		socketRef.current.emit("get-messages", user.id);
	};

	const value: MessageContextType = {
		messages,
		sendMessage,
		loadMessages,
		isConnected,
		read,
		setRead,
	};

	return (
		<MessageContext.Provider value={value}>{children}</MessageContext.Provider>
	);
};

export const useMessages = (): MessageContextType => {
	const context = React.useContext(MessageContext);
	if (context === undefined)
		throw new Error("useMessages must be used within a MessageProvider");
	return context;
};
