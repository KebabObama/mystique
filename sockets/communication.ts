import "dotenv/config";
import { randomUUID } from "node:crypto";
import http from "node:http";
import { and, arrayContains, eq, or } from "drizzle-orm";
import { Server } from "socket.io";
import * as schema from "@/db/schema";
import { db } from "@/lib/db";

const port = Number(process.env.NEXT_PUBLIC_COMMS_SOCKET_PORT ?? 4000);
const allowedOrigin = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

const httpServer = http.createServer();
const io = new Server(httpServer, {
	cors: {
		origin: allowedOrigin,
		methods: ["GET", "POST"],
		credentials: true,
		allowedHeaders: ["*"],
	},
	transports: ["websocket"],
});

io.on("connection", (socket) => {
	console.log(`✅ Socket connected: ${socket.id}`);

	socket.on("join-room", async (userId: string) => {
		try {
			const groups = await db
				.select()
				.from(schema.group)
				.where(arrayContains(schema.group.users, [userId]));

			socket.join(`user:${userId}`);
			for (const g of groups) socket.join(`group:${g.id}`);
			console.log(`User ${userId} joined ${groups.length} groups`);

			const friendships = await db
				.select()
				.from(schema.friend)
				.where(or(eq(schema.friend.a, userId), eq(schema.friend.b, userId)));

			const friendIds = friendships.map((f) => (f.a === userId ? f.b : f.a));

			const friends =
				friendIds.length > 0
					? await db
							.select({
								id: schema.user.id,
								name: schema.user.name,
								email: schema.user.email,
								image: schema.user.image,
							})
							.from(schema.user)
							.where(or(...friendIds.map((id) => eq(schema.user.id, id))))
					: [];

			const requests = await db
				.select()
				.from(schema.friendRequest)
				.where(eq(schema.friendRequest.receiver, userId));

			const senderIds = requests.map((r) => r.sender);
			const senders =
				senderIds.length > 0
					? await db
							.select({
								id: schema.user.id,
								name: schema.user.name,
								email: schema.user.email,
								image: schema.user.image,
							})
							.from(schema.user)
							.where(or(...senderIds.map((id) => eq(schema.user.id, id))))
					: [];

			const requestsWithSenderInfo = requests.map((req) => {
				const sender = senders.find((s) => s.id === req.sender);
				return {
					...req,
					senderName: sender?.name || "Unknown",
					senderEmail: sender?.email || "",
					senderImage: sender?.image || null,
				};
			});

			const messages = await db
				.select()
				.from(schema.message)
				.where(
					and(
						eq(schema.message.isGroup, false),
						or(
							eq(schema.message.sender, userId),
							eq(schema.message.link, userId),
						),
					),
				);

			socket.emit("initial-data", {
				friends: friends.map((f) => ({ ...f, friendship: "accepted" })),
				requests: requestsWithSenderInfo,
				messages,
				groups,
			});
		} catch (err) {
			console.error("join-room error:", err);
		}
	});

	socket.on("friend:send", async ({ senderId, receiverId }) => {
		try {
			await db.insert(schema.friendRequest).values({
				id: randomUUID(),
				sender: senderId,
				receiver: receiverId,
			});

			const [sender] = await db
				.select({
					id: schema.user.id,
					name: schema.user.name,
					email: schema.user.email,
					image: schema.user.image,
				})
				.from(schema.user)
				.where(eq(schema.user.id, senderId));

			io.to(`user:${receiverId}`).emit("friend:request:received", {
				sender: senderId,
				receiver: receiverId,
				senderName: sender?.name || "Unknown",
				senderEmail: sender?.email || "",
				senderImage: sender?.image || null,
			});
		} catch (err) {
			console.error("friend:send error:", err);
		}
	});

	socket.on("friend:accept", async ({ senderId, receiverId }) => {
		try {
			await db
				.delete(schema.friendRequest)
				.where(
					and(
						eq(schema.friendRequest.sender, senderId),
						eq(schema.friendRequest.receiver, receiverId),
					),
				);
			await db.insert(schema.friend).values({
				id: randomUUID(),
				a: senderId,
				b: receiverId,
			});

			// Fetch both users' details
			const [senderUser] = await db
				.select({
					id: schema.user.id,
					name: schema.user.name,
					email: schema.user.email,
					image: schema.user.image,
				})
				.from(schema.user)
				.where(eq(schema.user.id, senderId));

			const [receiverUser] = await db
				.select({
					id: schema.user.id,
					name: schema.user.name,
					email: schema.user.email,
					image: schema.user.image,
				})
				.from(schema.user)
				.where(eq(schema.user.id, receiverId));

			io.to(`user:${senderId}`).emit("friend:accepted", {
				...receiverUser,
				friendship: "accepted",
			});
			io.to(`user:${receiverId}`).emit("friend:accepted", {
				...senderUser,
				friendship: "accepted",
			});
		} catch (err) {
			console.error("friend:accept error:", err);
		}
	});

	socket.on("friend:deny", async ({ senderId, receiverId }) => {
		try {
			await db
				.delete(schema.friendRequest)
				.where(
					and(
						eq(schema.friendRequest.sender, senderId),
						eq(schema.friendRequest.receiver, receiverId),
					),
				);
			io.to(`user:${senderId}`).emit("friend:denied", { userId: receiverId });
		} catch (err) {
			console.error("friend:deny error:", err);
		}
	});

	socket.on("friend:remove", async ({ userId, friendId }) => {
		try {
			await db
				.delete(schema.friend)
				.where(
					or(
						and(eq(schema.friend.a, userId), eq(schema.friend.b, friendId)),
						and(eq(schema.friend.a, friendId), eq(schema.friend.b, userId)),
					),
				);

			// Notify both users that the friendship has been removed
			io.to(`user:${userId}`).emit("friend:removed", { friendId });
			io.to(`user:${friendId}`).emit("friend:removed", { friendId: userId });
		} catch (err) {
			console.error("friend:remove error:", err);
		}
	});

	socket.on("user:block", async ({ userId, blockedUserId }) => {
		try {
			await db
				.delete(schema.friend)
				.where(
					or(
						and(
							eq(schema.friend.a, userId),
							eq(schema.friend.b, blockedUserId),
						),
						and(
							eq(schema.friend.a, blockedUserId),
							eq(schema.friend.b, userId),
						),
					),
				);

			io.to(`user:${userId}`).emit("user:blocked", { userId: blockedUserId });
			io.to(`user:${blockedUserId}`).emit("friend:removed", {
				friendId: userId,
			});
		} catch (err) {
			console.error("user:block error:", err);
		}
	});

	socket.on(
		"message:send",
		async ({ senderId, linkId, text, isGroup = false }) => {
			try {
				const msg = {
					id: randomUUID(),
					link: linkId,
					isGroup,
					sender: senderId,
					text,
				};
				await db.insert(schema.message).values(msg);
				const room = isGroup ? `group:${linkId}` : `user:${linkId}`;
				io.to(room).emit("message:new", msg);
			} catch (err) {
				console.error("message:send error:", err);
			}
		},
	);

	socket.on("group:create", async ({ creatorId, userIds, name }) => {
		try {
			const users = Array.from(new Set([...userIds, creatorId]));
			const [newGroup] = await db
				.insert(schema.group)
				.values({
					id: randomUUID(),
					users,
					name,
				})
				.returning({ id: schema.group.id });

			for (const userId of users)
				io.to(`user:${userId}`).emit("group:created", {
					id: newGroup.id,
					name,
					users,
				});
		} catch (err) {
			console.error("group:create error:", err);
		}
	});

	socket.on("disconnect", () =>
		console.log(`🔌 Socket disconnected: ${socket.id}`),
	);
});

httpServer.listen(port, () => {
	console.log(`✅ Socket.IO running on port ${port}`);
});
