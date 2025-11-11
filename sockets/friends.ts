import {
	acceptRequest,
	denyRequest,
	getForMeRequests,
	getFriends,
	getFromMeRequests,
	sendRequest,
} from "@/lib/friend";
import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";

const httpServer = http.createServer();
const port = Number(process.env.NEXT_PUBLIC_FRIENDS_SOCKET_PORT);

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

	socket.on("join", (userId: string) => {
		socket.join(userId);
		console.log(`User ${userId} joined room`);
	});

	socket.on("get-all", async (userId: string) => {
		const [friends, requestsForMe, requestsFromMe] = await Promise.all([
			getFriends(userId),
			getForMeRequests(userId),
			getFromMeRequests(userId),
		]);
		io.to(userId).emit("friends-data", {
			friends,
			requestsForMe,
			requestsFromMe,
		});
	});

	socket.on("send-request", async ({ senderId, receiverId }) => {
		await sendRequest(senderId, receiverId);
		io.to(senderId).emit("refresh");
		io.to(receiverId).emit("refresh");
	});

	socket.on("accept-request", async ({ senderId, receiverId }) => {
		await acceptRequest(senderId, receiverId);
		io.to(senderId).emit("refresh");
		io.to(receiverId).emit("refresh");
	});

	socket.on("deny-request", async ({ senderId, receiverId }) => {
		await denyRequest(senderId, receiverId);
		io.to(senderId).emit("refresh");
		io.to(receiverId).emit("refresh");
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

httpServer.listen(port, () => {
	console.log(`Friends Socket.IO running on :${port}`);
});
