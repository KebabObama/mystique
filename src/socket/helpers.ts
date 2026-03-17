import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { diffStateSync } from "@/lib/game-state";
import * as Lobby from "@/lib/lobby";
import { and, eq } from "drizzle-orm";
import type { Server, Socket } from "socket.io";

/** Represents the socket context type. */
export type SocketContext = { socket: Socket; io: Server; instances: Map<string, Game.Instance> };

/** Defines the is position constant. */
export const isPosition = (value: unknown): value is Game.Position => {
  if (!value || typeof value !== "object") return false;
  const point = value as Partial<Game.Position>;
  return typeof point.x === "number" && typeof point.z === "number";
};

/** Defines the exists constant. */
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

/** Provides the emit full state function. */
export const emitFullState = (socket: Socket, instance: Game.Instance) => {
  socket.emit("game:state", { type: "full", instance } satisfies Game.StateSync);
};

const syncInstance = (ctx: SocketContext, fresh: Game.Instance, event?: string) => {
  const sync = diffStateSync(ctx.instances.get(fresh.id), fresh);
  ctx.instances.set(fresh.id, fresh);

  if (sync) ctx.io.to(`game:${fresh.id}`).emit("game:state", sync);
  if (event) ctx.io.to(`game:${fresh.id}`).emit(event);

  return fresh;
};

/** Provides the refresh function. */
export const refresh = async (ctx: SocketContext, lobbyId: string, event?: string) => {
  const fresh = await Lobby.getInstance(lobbyId);
  return syncInstance(ctx, fresh, event);
};

/** Provides the update function. */
export const update = async (ctx: SocketContext, fresh: Game.Instance, event?: string) => {
  await db.update(schema.lobby).set({ data: fresh.data }).where(eq(schema.lobby.id, fresh.id));
  return syncInstance(ctx, fresh, event);
};

/** Provides the normalize quantity function. */
export const normalizeQuantity = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
};

/** Provides the upsert character inventory function. */
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

/** Provides the upsert chest inventory function. */
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
