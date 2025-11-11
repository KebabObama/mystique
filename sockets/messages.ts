import { cache } from "@/lib/cache";
import { getUserMessages, uploadNewMessage } from "@/lib/conversations";
import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";

const httpServer = http.createServer();
const port = Number(process.env.NEXT_PUBLIC_MESSAGE_SOCKET_PORT);

export type Message = {
	users: string[];
	data: {
		sender: { id: string; name: string };
		text: string;
		timestamp: string;
	};
};

const io = new Server(httpServer, {
	cors: {
		origin: process.env.BETTER_AUTH_URL,
		methods: ["GET", "POST"],
		credentials: true,
		allowedHeaders: ["*"],
	},
	transports: ["websocket"],
});

io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	socket.on("join-room", (userId: string) => {
		socket.join(userId);
		console.log(`User ${socket.id} joined room: ${userId}`);
	});

	socket.on("get-messages", async (userId: string) => {
		const cacheKey = `messages:${userId}`;
		try {
			const cachedMessages = await cache.get(cacheKey);
			if (cachedMessages) {
				console.log(`Cache hit for user ${userId}`);
				const messages = JSON.parse(cachedMessages);
				io.to(userId).emit("get-messages", messages);
				return;
			}
			console.log(`Cache miss for user ${userId}, fetching from database`);
			const messages = await getUserMessages(userId);
			await cache.set(cacheKey, JSON.stringify(messages));
			console.log(`${userId} requested messages: `, messages);
			io.to(userId).emit("get-messages", messages);
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	});

	socket.on("message", async (msg: Message) => {
		const cacheInvalidationPromises = msg.users.map(async (userId) => {
			const cacheKey = `messages:${userId}`;
			try {
				await cache.del(cacheKey);
				console.log(`Invalidated cache for user: ${userId}`);
			} catch (error) {
				console.error(`Error invalidating cache for user ${userId}:`, error);
			}
		});
		await Promise.allSettled(cacheInvalidationPromises);
		msg.users.forEach((userId) => {
			io.to(userId).emit("message", msg);
		});
		await uploadNewMessage(msg);
	});
	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

httpServer.listen(port, () => {
	console.log(`Socket.IO running on :${port}`);
});
