"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "@/components/layout/toast";
import { authClient } from "@/lib/auth-client";

export type FriendData = {
	id: string;
	email: string;
	name: string;
	image: string | null;
	bio: string | null;
	sender: string;
	receiver: string;
};

type FriendsContextType = {
	friends: FriendData[];
	requestsForMe: FriendData[];
	requestsFromMe: FriendData[];
	loading: boolean;
	sendRequest: (receiverId: string) => void;
	acceptRequest: (senderId: string) => void;
	denyRequest: (senderId: string) => void;
	refresh: () => void;
};

const FriendsContext = createContext<FriendsContextType | null>(null);

export const FriendsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const user = authClient.useSession().data?.user;
	const [socket, setSocket] = useState<Socket | null>(null);
	const [friends, setFriends] = useState<FriendData[]>([]);
	const [requestsForMe, setRequestsForMe] = useState<FriendData[]>([]);
	const [requestsFromMe, setRequestsFromMe] = useState<FriendData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;
		const s = io(process.env.NEXT_PUBLIC_FRIENDS_SOCKET_URL as string, {
			withCredentials: true,
			transports: ["websocket"],
		});
		setSocket(s);

		s.emit("join", user.id);
		s.emit("get-all", user.id);

		s.on("friends-data", (data) => {
			setFriends(data.friends);
			setRequestsForMe(data.requestsForMe);
			setRequestsFromMe(data.requestsFromMe);
			setLoading(false);
		});

		s.on("refresh", () => {
			s.emit("get-all", user.id);
		});

		return () => {
			s.disconnect();
		};
	}, [user?.id, user]);

	const sendRequest = (receiverId: string) => {
		if (!user) return;
		socket?.emit("send-request", { senderId: user.id, receiverId });
		toast.success("Request sent");
	};

	const acceptRequest = (senderId: string) => {
		if (!user) return;
		socket?.emit("accept-request", { senderId, receiverId: user.id });
		toast.success("Request accepted");
	};

	const denyRequest = (senderId: string) => {
		if (!user) return;
		socket?.emit("deny-request", { senderId, receiverId: user.id });
		toast.success("Request denied");
	};

	const refresh = () => {
		if (!user) return;
		socket?.emit("get-all", user.id);
	};

	return (
		<FriendsContext.Provider
			value={{
				friends,
				requestsForMe,
				requestsFromMe,
				loading,
				sendRequest,
				acceptRequest,
				denyRequest,
				refresh,
			}}
		>
			{children}
		</FriendsContext.Provider>
	);
};

export const useFriends = () => {
	const ctx = useContext(FriendsContext);
	if (!ctx) throw new Error("useFriends must be used inside FriendsProvider");
	return ctx;
};
