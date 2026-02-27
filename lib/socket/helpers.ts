import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import * as Lobby from "@/lib/lobby";
import { and, eq } from "drizzle-orm";
import type { Server, Socket } from "socket.io";

export type SocketContext = { socket: Socket; io: Server; instances: Map<string, Game.Instance> };

export const isPosition = (value: unknown): value is Game.Position => {
  if (!value || typeof value !== "object") return false;
  const point = value as Partial<Game.Position>;
  return typeof point.x === "number" && typeof point.z === "number";
};

export const exists = async (
  ctx: SocketContext,
  userId: string,
  lobbyId: string,
  check = false
): Promise<Game.Instance | null> => {
  let inst = ctx.instances.get(lobbyId);
  if (!inst || check) {
    inst = await Lobby.getInstance(lobbyId);
    if (!inst) {
      ctx.socket.emit("error", "Lobby does not exist");
      return null;
    }
    ctx.instances.set(lobbyId, inst);
  }
  if (!inst) {
    ctx.socket.emit("error", "Lobby does not exist");
    return null;
  }
  if (inst.members.every((e) => e.id !== userId)) {
    ctx.socket.emit("error", `You are not member of lobby: ${inst.id}`);
    return null;
  }
  return inst;
};

export const update = async (ctx: SocketContext, fresh: Game.Instance, event?: string) => {
  await db.update(schema.lobby).set({ data: fresh.data }).where(eq(schema.lobby.id, fresh.id));
  ctx.instances.set(fresh.id, fresh);
  ctx.io.to(`game:${fresh.id}`).emit(event ?? "game:state", fresh);
};

export const normalizeQuantity = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
};

export const upsertCharacterInventory = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  characterId: string,
  itemId: string,
  quantity: number
) => {
  const existing = await tx.query.inventory.findFirst({
    where: and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId)),
  });

  if (!existing) {
    await tx.insert(schema.inventory).values({ characterId, itemId, quantity });
    return;
  }

  await tx
    .update(schema.inventory)
    .set({ quantity: existing.quantity + quantity })
    .where(and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId)));
};

export const upsertChestInventory = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  chestId: string,
  itemId: string,
  quantity: number
) => {
  const existing = await tx.query.chestInventory.findFirst({
    where: and(
      eq(schema.chestInventory.chestId, chestId),
      eq(schema.chestInventory.itemId, itemId)
    ),
  });

  if (!existing) {
    await tx.insert(schema.chestInventory).values({ chestId, itemId, quantity });
    return;
  }

  await tx
    .update(schema.chestInventory)
    .set({ quantity: existing.quantity + quantity })
    .where(
      and(eq(schema.chestInventory.chestId, chestId), eq(schema.chestInventory.itemId, itemId))
    );
};
