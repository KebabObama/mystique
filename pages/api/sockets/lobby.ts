import { Lobby } from "@/lib/lobby";
import { NextApiResponseWithSocket } from "@/types/socket";
import type { NextApiRequest } from "next";
import { Server } from "socket.io";

export default (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
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
      Lobby.leave(userId, lobbyId);
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
  });

  res.end();
};
