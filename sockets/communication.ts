import * as schema from "@/db/schema";
import { db } from "@/lib/db";
import { Friend, Message, SendMessage, User } from "@/types/communication";
import "dotenv/config";
import { and, eq, inArray, ne, or } from "drizzle-orm";
import http from "node:http";
import { Server } from "socket.io";

const port = Number(process.env.NEXT_PUBLIC_COMMS_SOCKET_PORT as string);

const httpServer = http.createServer();
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
  socket.on("join-room", async (userId: string) => {
    const friendships = await db
      .select({
        id: schema.friend.id,
        friend: schema.user.id,
        name: schema.user.name,
        image: schema.user.image,
        sender: schema.friend.sender,
        accepted: schema.friend.accepted,
      })
      .from(schema.friend)
      .innerJoin(
        schema.user,
        or(
          and(
            ne(schema.friend.sender, userId),
            eq(schema.friend.sender, schema.user.id)
          ),
          and(
            ne(schema.friend.receiver, userId),
            eq(schema.friend.receiver, schema.user.id)
          )
        )
      )
      .where(
        or(eq(schema.friend.sender, userId), eq(schema.friend.receiver, userId))
      );

    const messages = await db
      .select()
      .from(schema.message)
      .where(
        inArray(
          schema.message.link,
          friendships.map((f) => f.id)
        )
      );
    socket.join(`user:${userId}`);
    socket.join(friendships.map((e) => `friend:${e.id}`));
    socket.emit("message:all", messages as Message[]);
    socket.emit("friend:all", friendships as Friend[]);
  });

  socket.on("friend:new", async (sender: User, receiver: string) => {
    const request = await db
      .insert(schema.friend)
      .values({ sender: sender.id, receiver: receiver, accepted: false })
      .returning()
      .then((res) => res[0]);
    io.to([`user:${sender.id}`, `user:${receiver}`]).socketsJoin(
      `friend:${request.id}`
    );
    io.to(`user:${receiver}`).emit("friend:new", {
      id: request.id,
      friend: sender.id,
      name: sender.name,
      image: sender.image,
      sender: sender.id,
      accepted: request.accepted,
    } as Friend);
    const data = await db
      .select({ name: schema.user.name, image: schema.user.image })
      .from(schema.user)
      .where(eq(schema.user.id, receiver))
      .then((e) => e[0]);
    io.to(`user:${sender.id}`).emit("friend:new", {
      id: request.id,
      friend: receiver,
      name: data.name,
      image: data.image,
      sender: sender.id,
      accepted: request.accepted,
    } as Friend);
  });

  socket.on("friend:accept", async (id: string) => {
    await db
      .update(schema.friend)
      .set({ accepted: true })
      .where(eq(schema.friend.id, id));
    io.to(`friend:${id}`).emit("friend:accept", id);
  });

  socket.on("friend:deny", async (id: string) => {
    io.to(`friend:${id}`).emit("friend:deny", id);
    io.to(`friend:${id}`).socketsLeave(`friend:${id}`);
    await db.delete(schema.friend).where(eq(schema.friend.id, id));
    await db
      .delete(schema.message)
      .where(
        and(eq(schema.message.type, "friend"), eq(schema.message.link, id))
      );
  });

  socket.on("message:new", async (temp: SendMessage) => {
    const msg = await db
      .insert(schema.message)
      .values(temp)
      .returning()
      .then((e) => e[0]);
    io.to(`${msg.type}:${msg.link}`).emit("message:new", msg);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`✅ Socket.IO running on port ${port}`);
});
