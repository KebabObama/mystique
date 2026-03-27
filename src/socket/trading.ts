import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { Trading } from "@/lib/trading";
import { and, eq } from "drizzle-orm";
import { type SocketContext, exists, refresh, upsertCharacterInventory } from "./helpers";

type CharacterEntity = Extract<Game.Entity, { type: "character" }>;

const activeTradeSessions = new Map<string, Trading.Session>();

const createTradeId = () => `trade_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

const isParticipantController = (
  inst: Awaited<ReturnType<typeof exists>>,
  userId: string,
  entityId: string
) => {
  if (!inst) return false;
  const entity = InGameHelpers.getEntities(inst).find((entry) => entry.id === entityId);
  if (!entity || entity.type !== "character") return false;
  return entity.ownerId === userId || inst.masterId === userId;
};

const sanitizeOffer = (
  offer: { items?: Array<{ itemId: string; quantity: number }>; currency?: number },
  entity: CharacterEntity
): Trading.Offer => {
  const normalized = new Map<string, number>();

  for (const raw of offer.items ?? []) {
    const itemId = raw.itemId;
    const owned = Number(entity.inventory.find((e) => e.id === itemId)?.quantity ?? 0);
    if (owned <= 0) continue;

    const requested = Math.max(0, Math.floor(raw.quantity));
    if (requested <= 0) continue;

    const current = normalized.get(itemId) ?? 0;
    normalized.set(itemId, Math.min(owned, current + requested));
  }

  return {
    items: Array.from(normalized.entries()).map(([itemId, quantity]) => ({ itemId, quantity })),
    currency: Math.min(entity.coins, Math.max(0, Math.floor(offer.currency as number))),
  };
};

const findPairSession = (lobbyId: string, aId: string, bId: string) => {
  return Array.from(activeTradeSessions.values()).find(
    (session) =>
      session.lobbyId === lobbyId &&
      ((session.entityAId === aId && session.entityBId === bId) ||
        (session.entityAId === bId && session.entityBId === aId))
  );
};

const emitSession = (ctx: SocketContext, session: Trading.Session) => {
  ctx.io.to(`game:${session.lobbyId}`).emit("game:trade:session", session);
};

const emitClosed = (
  ctx: SocketContext,
  lobbyId: string,
  sessionId: string,
  reason: "cancelled" | "completed"
) => {
  ctx.io.to(`game:${lobbyId}`).emit("game:trade:session:closed", { sessionId, reason });
};

const debitCharacterInventory = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  characterId: string,
  itemId: string,
  quantity: number
) => {
  const source = await tx.query.inventory.findFirst({
    where: and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId)),
  });

  if (!source || source.quantity < quantity) {
    throw new Error("Insufficient trade items");
  }

  if (source.quantity === quantity) {
    await tx
      .delete(schema.inventory)
      .where(
        and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId))
      );
    return;
  }

  await tx
    .update(schema.inventory)
    .set({ quantity: source.quantity - quantity })
    .where(and(eq(schema.inventory.characterId, characterId), eq(schema.inventory.itemId, itemId)));
};

const debitCharacterCoins = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  characterId: string,
  amount: number
) => {
  if (amount <= 0) return;

  const character = await tx.query.character.findFirst({
    where: eq(schema.character.id, characterId),
  });

  if (!character || character.coins < amount) {
    throw new Error("Insufficient trade currency");
  }

  await tx
    .update(schema.character)
    .set({ coins: character.coins - amount })
    .where(eq(schema.character.id, characterId));
};

const creditCharacterCoins = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  characterId: string,
  amount: number
) => {
  if (amount <= 0) return;

  const character = await tx.query.character.findFirst({
    where: eq(schema.character.id, characterId),
  });

  if (!character) {
    throw new Error("Trade participant is no longer valid");
  }

  await tx
    .update(schema.character)
    .set({ coins: character.coins + amount })
    .where(eq(schema.character.id, characterId));
};

const settleTrade = async (
  inst: NonNullable<Awaited<ReturnType<typeof exists>>>,
  session: Trading.Session
) => {
  const entityA = InGameHelpers.getEntities(inst).find(
    (entry): entry is CharacterEntity =>
      entry.id === session.entityAId && entry.type === "character"
  );
  const entityB = InGameHelpers.getEntities(inst).find(
    (entry): entry is CharacterEntity =>
      entry.id === session.entityBId && entry.type === "character"
  );

  if (!entityA || !entityB) {
    throw new Error("Trade participants are no longer valid");
  }

  await db.transaction(async (tx) => {
    const offerA = session.offers[session.entityAId] ?? Trading.EMPTY_OFFER;
    const offerB = session.offers[session.entityBId] ?? Trading.EMPTY_OFFER;

    for (const item of offerA.items) {
      await debitCharacterInventory(tx, entityA.characterId, item.itemId, item.quantity);
      await upsertCharacterInventory(tx, entityB.characterId, item.itemId, item.quantity);
    }

    for (const item of offerB.items) {
      await debitCharacterInventory(tx, entityB.characterId, item.itemId, item.quantity);
      await upsertCharacterInventory(tx, entityA.characterId, item.itemId, item.quantity);
    }

    if (offerA.currency > 0) {
      await debitCharacterCoins(tx, entityA.characterId, offerA.currency);
      await creditCharacterCoins(tx, entityB.characterId, offerA.currency);
    }

    if (offerB.currency > 0) {
      await debitCharacterCoins(tx, entityB.characterId, offerB.currency);
      await creditCharacterCoins(tx, entityA.characterId, offerB.currency);
    }
  });
};

const isParticipant = (inst: Game.Instance, userId: string, array: string[]) => {
  return array.some((entityId) => isParticipantController(inst, userId, entityId));
};

/** Registers the trading socket handlers. */
export const register = (ctx: SocketContext) => {
  const { socket } = ctx;

  socket.on("game:trade:request", async (userId, lobbyId, fromEntityId, toEntityId, payload) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const fromEntity = InGameHelpers.getEntities(inst).find((e) => e.id === fromEntityId);
    const toEntity = InGameHelpers.getEntities(inst).find((e) => e.id === toEntityId);

    if (!fromEntity || !toEntity) return;
    if (fromEntity.type !== "character" || toEntity.type !== "character") return;
    if (fromEntityId === toEntityId) return;
    if (!isParticipantController(inst, userId, fromEntityId)) return;

    const existing = findPairSession(lobbyId, fromEntityId, toEntityId);
    if (existing) {
      emitSession(ctx, existing);
      return;
    }

    const sessionId = createTradeId();
    const offerFrom = sanitizeOffer(payload, fromEntity);

    const session: Trading.Session = {
      id: sessionId,
      lobbyId,
      entityAId: fromEntityId,
      entityBId: toEntityId,
      offers: { [fromEntityId]: offerFrom, [toEntityId]: { ...Trading.EMPTY_OFFER } },
      confirmed: { [fromEntityId]: false, [toEntityId]: false },
      updatedAt: Date.now(),
    };

    activeTradeSessions.set(sessionId, session);
    emitSession(ctx, session);
  });

  socket.on("game:trade:update", async (userId, lobbyId, sessionId, actorEntityId, payload) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const session = activeTradeSessions.get(sessionId);
    if (!session || session.lobbyId !== lobbyId) return;

    if (actorEntityId !== session.entityAId && actorEntityId !== session.entityBId) return;
    if (!isParticipantController(inst, userId, actorEntityId)) return;

    const participantEntity = InGameHelpers.getEntities(inst).find(
      (entry): entry is CharacterEntity => entry.id === actorEntityId && entry.type === "character"
    );
    if (!participantEntity) return;

    session.offers[actorEntityId] = sanitizeOffer(payload, participantEntity);
    session.confirmed[session.entityAId] = false;
    session.confirmed[session.entityBId] = false;
    session.updatedAt = Date.now();

    emitSession(ctx, session);
  });

  socket.on(
    "game:trade:confirm",
    async (userId, lobbyId, sessionId, actorEntityId, ready = true) => {
      const inst = await exists(ctx, userId, lobbyId);
      if (!inst) return;

      const session = activeTradeSessions.get(sessionId);
      if (!session || session.lobbyId !== lobbyId) return;

      if (actorEntityId !== session.entityAId && actorEntityId !== session.entityBId) return;
      if (!isParticipantController(inst, userId, actorEntityId)) return;

      session.confirmed[actorEntityId] = Boolean(ready);
      session.updatedAt = Date.now();

      const bothConfirmed =
        session.confirmed[session.entityAId] && session.confirmed[session.entityBId];
      if (!bothConfirmed) {
        emitSession(ctx, session);
        return;
      }

      try {
        await settleTrade(inst, session);
        activeTradeSessions.delete(session.id);

        ctx.io
          .to(`game:${inst.id}`)
          .emit("game:message", { message: "Trade completed successfully.", variant: "success" });

        emitClosed(ctx, lobbyId, session.id, "completed");
        await refresh(ctx, lobbyId);
      } catch (error) {
        session.confirmed[session.entityAId] = false;
        session.confirmed[session.entityBId] = false;
        socket.emit("game:message", {
          message: error instanceof Error ? error.message : "Trade failed",
          variant: "error",
        });
        emitSession(ctx, session);
      }
    }
  );

  socket.on("game:trade:cancel", async (userId, lobbyId, sessionId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const session = activeTradeSessions.get(sessionId);
    if (!session || session.lobbyId !== lobbyId) return;

    const canCancel = [session.entityAId, session.entityBId].some((entityId) =>
      isParticipantController(inst, userId, entityId)
    );
    if (!canCancel) return;

    activeTradeSessions.delete(session.id);
    emitClosed(ctx, lobbyId, session.id, "cancelled");
  });

  socket.on("game:trade:list", async (userId, lobbyId) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    socket.emit(
      "game:trade:list",
      activeTradeSessions
        .values()
        .filter(
          (s) => s.lobbyId === lobbyId && isParticipant(inst, userId, [s.entityAId, s.entityBId])
        )
    );
  });
};
