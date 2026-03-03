import * as Lobby from "@/lib/lobby";
import type { SocketContext } from "./helpers";

export const register = (ctx: SocketContext) => {
  const { socket, io } = ctx;

  socket.on("lobby:get", async (userId) => {
    const lobbies = await Lobby.getAll(userId);
    lobbies.forEach((e) => socket.join(`lobby:${e.id}`));
    socket.emit("lobby:get", lobbies);
  });

  socket.on("lobby:create", async (userId, name) => {
    const result = await Lobby.create(userId, name);
    socket.join(`lobby:${result.id}`);
    socket.emit("lobby:create", result);
  });

  socket.on("lobby:leave", async (userId, lobbyId) => {
    await Lobby.leave(userId, lobbyId);
    socket.emit("lobby:leave", lobbyId);
  });

  socket.on("lobby:join", async (userId, lobbyId) => {
    const result = await Lobby.join(userId, lobbyId);
    socket.join(`lobby:${result.id}`);
    io.to(`lobby:${result.id}`).emit("lobby:join", result);
  });

  socket.on("lobby:send", async (userId, lobbyId, content) => {
    const result = await Lobby.send(userId, lobbyId, content);
    io.to(`lobby:${result.lobbyId}`).emit("lobby:send", result);
  });

  socket.on("lobby:markRead", async (userId, lobbyId) => {
    const lastReadAt = await Lobby.markAsRead(userId, lobbyId);
    if (lastReadAt) {
      socket.emit("lobby:markRead", { lobbyId, userId, lastReadAt });
    }
  });
};
