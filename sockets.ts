/** biome-ignore-all lint/suspicious/noExplicitAny: <permit any> */
import "dotenv/config";
import http from "node:http";
import { type DefaultEventsMap, Server, type Socket as SOC } from "socket.io";
import { friendshipCRUD } from "./lib/friendship";

export type Socket = SOC<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	any
>;

const httpServer = http.createServer();
const port = Number(process.env.NEXT_PUBLIC_SOCKET_PORT);

const io = new Server(httpServer, {
	cors: {
		origin: process.env.BETTER_AUTH_URL,
		methods: ["GET", "POST"],
		credentials: true,
		allowedHeaders: ["*"],
	},
	transports: ["websocket"],
});

const userRoom = (userId: string) => `user:${userId}`;

io.on("connection", (socket) => {
	socket.on("join", (userId) => {
		socket.join(userRoom(userId));
	});

	socket.on("select-friendships", async (userId) => {
		const temp = await friendshipCRUD.getAll(userId);
		io.to(userRoom(userId)).emit("get-friendships", temp);
	});

	socket.on("send-friendships", async (sender, receiver) => {
		await friendshipCRUD.send(sender, receiver);
		const temp = await friendshipCRUD.getAll(sender);
		io.to(userRoom(sender)).emit("get-friendships", temp);
		io.to(userRoom(receiver)).emit("get-friendships", temp);
	});

	socket.on("state-friendship", async (friendship, state) => {
		await friendshipCRUD.accept(friendship.id, state);
		const temp = await friendshipCRUD.getAll(friendship.sender);
		io.to(userRoom(friendship.sender)).emit("get-friendships", temp);
		io.to(userRoom(friendship.sender)).emit("get-friendships", temp);
	});
});

httpServer.listen(port, () => {
	console.log(`Socket.IO running on :${port}`);
});
