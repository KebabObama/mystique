/**
 * Zustand store for Socket.IO connection and real-time communication
 * Uses callbacks to avoid dependency issues in useEffect
 *
 * @example
 * ```tsx
 * import { useSocket } from "@/hooks/use-socket";
 *
 * function MyComponent() {
 *   const connected = useSocket((state) => state.connected);
 *   const friendships = useSocket((state) => state.friendships);
 *   const connect = useSocket((state) => state.connect);
 *   const join = useSocket((state) => state.join);
 *   const selectFriendships = useSocket((state) => state.selectFriendships);
 *   const disconnect = useSocket((state) => state.disconnect);
 *
 *   const userId = "user-id-here";
 *
 *   useEffect(() => {
 *     connect();
 *     join(userId);
 *     selectFriendships(userId);
 *
 *     return () => disconnect();
 *   }, [connect, join, selectFriendships, disconnect, userId]);
 *
 *   return <div>Connected: {connected ? "Yes" : "No"}</div>;
 * }
 * ```
 */
"use client";

import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import type { CRUD } from "@/lib/friendship";

// Types for socket events
type FriendshipData = {
	friendshipId: string;
	state: number;
	sender: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
	receiver: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
};

type Message = Awaited<ReturnType<typeof CRUD.message.getAll>>[number];
type MessageInsert = CRUD.message.Insert;

interface SocketState {
	socket: Socket | null;
	connected: boolean;
	friendships: FriendshipData[];
	messages: Message[];

	// Connection methods
	connect: () => void;
	disconnect: () => void;

	// User methods
	join: (userId: string) => void;

	// Friendship methods
	selectFriendships: (userId: string) => void;
	sendFriendship: (sender: string, receiver: string) => void;
	stateFriendship: (
		friendship: { id: string; sender: string },
		state: number,
	) => void;

	// Message methods
	selectMessages: (userId: string) => void;
	sendMessage: (msg: MessageInsert) => void;
}

let socketInstance: Socket | null = null;

export const useSocket = create<SocketState>((set, _get) => ({
	socket: null,
	connected: false,
	friendships: [],
	messages: [],

	connect: () => {
		if (socketInstance?.connected) return;

		socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
			transports: ["websocket"],
			autoConnect: true,
		});

		// Connection event handlers
		socketInstance.on("connect", () => {
			console.log("Socket connected");
			set({ connected: true, socket: socketInstance });
		});

		socketInstance.on("disconnect", () => {
			console.log("Socket disconnected");
			set({ connected: false });
		});

		socketInstance.on("connect_error", (error) => {
			console.error("Socket connection error:", error);
			set({ connected: false });
		});

		// Friendship event handlers
		socketInstance.on("get-friendships", (friendships: FriendshipData[]) => {
			console.log("Received friendships:", friendships);
			set({ friendships });
		});

		// Message event handlers
		socketInstance.on("get-messages", (messages: Message[]) => {
			console.log("Received messages:", messages);
			set({ messages });
		});

		socketInstance.on("receive-message", (message: Message) => {
			console.log("Received new message:", message);
			set((state) => ({
				messages: [...state.messages, message],
			}));
		});

		set({ socket: socketInstance });
	},

	disconnect: () => {
		if (socketInstance) {
			socketInstance.disconnect();
			socketInstance = null;
			set({ socket: null, connected: false });
		}
	},

	join: (userId: string) => {
		if (socketInstance?.connected) {
			console.log("Joining user room:", userId);
			socketInstance.emit("join", userId);
		} else {
			console.warn("Socket not connected. Cannot join room.");
		}
	},

	selectFriendships: (userId: string) => {
		if (socketInstance?.connected) {
			console.log("Selecting friendships for user:", userId);
			socketInstance.emit("select-friendships", userId);
		} else {
			console.warn("Socket not connected. Cannot select friendships.");
		}
	},

	sendFriendship: (sender: string, receiver: string) => {
		if (socketInstance?.connected) {
			console.log("Sending friendship request:", { sender, receiver });
			socketInstance.emit("send-friendships", sender, receiver);
		} else {
			console.warn("Socket not connected. Cannot send friendship.");
		}
	},

	stateFriendship: (
		friendship: { id: string; sender: string },
		state: number,
	) => {
		if (socketInstance?.connected) {
			console.log("Updating friendship state:", { friendship, state });
			socketInstance.emit("state-friendship", friendship, state);
		} else {
			console.warn("Socket not connected. Cannot update friendship state.");
		}
	},

	selectMessages: (userId: string) => {
		if (socketInstance?.connected) {
			console.log("Selecting messages for user:", userId);
			socketInstance.emit("select-messages", userId);
		} else {
			console.warn("Socket not connected. Cannot select messages.");
		}
	},

	sendMessage: (msg: MessageInsert) => {
		if (socketInstance?.connected) {
			console.log("Sending message:", msg);
			socketInstance.emit("send-message", msg);
		} else {
			console.warn("Socket not connected. Cannot send message.");
		}
	},
}));
