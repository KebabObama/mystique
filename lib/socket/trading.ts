import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import * as Lobby from "@/lib/lobby";
import { and, eq } from "drizzle-orm";
import { type SocketContext, exists, update, upsertCharacterInventory } from "./helpers";

interface TradeOffer {
  items: Array<{ itemId: string; quantity: number }>;
  currency: number;
}

interface TradeSession {
  id: string;
  lobbyId: string;
  entityAId: string;
  entityBId: string;
  offers: Record<string, TradeOffer>;
  confirmed: Record<string, boolean>;
  updatedAt: number;
}

type CharacterEntity = Extract<Game.Entity, { type: "character" }>;

const activeTradeSessions = new Map<string, TradeSession>();

const EMPTY_OFFER: TradeOffer = { items: [], currency: 0 };

const createTradeId = () => `trade_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

const isParticipantController = (
  inst: Awaited<ReturnType<typeof exists>>,
  userId: string,
  entityId: string
) => {
  if (!inst) return false;
  const entity = inst.entities.find((entry) => entry.id === entityId);
  if (!entity || entity.type !== "character") return false;
  return entity.playable.ownerId === userId || inst.masterId === userId;
};

const sanitizeOffer = (offer: unknown, entity: CharacterEntity): TradeOffer => {
  const payload = (offer ?? {}) as {
    items?: Array<{ itemId?: unknown; quantity?: unknown }>;
    currency?: unknown;
  };

  const ownedByItemId = new Map<string, number>(
    entity.playable.inventory.map((entry) => [entry.item.id, entry.quantity])
  );
  const normalized = new Map<string, number>();

  for (const raw of payload.items ?? []) {
    if (typeof raw?.itemId !== "string") continue;
    if (typeof raw?.quantity !== "number" || !Number.isFinite(raw.quantity)) continue;

    const itemId = raw.itemId;
    const owned = Number(ownedByItemId.get(itemId) ?? 0);
    if (owned <= 0) continue;

    const requested = Math.max(0, Math.floor(raw.quantity));
    if (requested <= 0) continue;

    const current = normalized.get(itemId) ?? 0;
    normalized.set(itemId, Math.min(owned, current + requested));
  }

  const coinEntry = entity.playable.inventory.find((entry) => entry.item.name === "Gold Coin");
  const maxCurrency = coinEntry?.quantity ?? 0;
  const requestedCurrency =
    typeof payload.currency === "number" && Number.isFinite(payload.currency)
      ? Math.max(0, Math.floor(payload.currency))
      : 0;

  return {
    items: Array.from(normalized.entries()).map(([itemId, quantity]) => ({ itemId, quantity })),
    currency: Math.min(maxCurrency, requestedCurrency),
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

const emitSession = (ctx: SocketContext, session: TradeSession) => {
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

const settleTrade = async (
  inst: NonNullable<Awaited<ReturnType<typeof exists>>>,
  session: TradeSession
) => {
  const entityA = inst.entities.find(
    (entry): entry is CharacterEntity =>
      entry.id === session.entityAId && entry.type === "character"
  );
  const entityB = inst.entities.find(
    (entry): entry is CharacterEntity =>
      entry.id === session.entityBId && entry.type === "character"
  );

  if (!entityA || !entityB) {
    throw new Error("Trade participants are no longer valid");
  }

  await db.transaction(async (tx) => {
    const offerA = session.offers[session.entityAId] ?? EMPTY_OFFER;
    const offerB = session.offers[session.entityBId] ?? EMPTY_OFFER;

    for (const item of offerA.items) {
      await debitCharacterInventory(tx, entityA.playable.id, item.itemId, item.quantity);
      await upsertCharacterInventory(tx, entityB.playable.id, item.itemId, item.quantity);
    }

    for (const item of offerB.items) {
      await debitCharacterInventory(tx, entityB.playable.id, item.itemId, item.quantity);
      await upsertCharacterInventory(tx, entityA.playable.id, item.itemId, item.quantity);
    }

    const hasCurrency = offerA.currency > 0 || offerB.currency > 0;
    if (hasCurrency) {
      const currencyItem = await tx.query.item.findFirst({
        where: eq(schema.item.name, "Gold Coin"),
      });
      if (!currencyItem) throw new Error("Currency item does not exist");

      if (offerA.currency > 0) {
        await debitCharacterInventory(tx, entityA.playable.id, currencyItem.id, offerA.currency);
        await upsertCharacterInventory(tx, entityB.playable.id, currencyItem.id, offerA.currency);
      }

      if (offerB.currency > 0) {
        await debitCharacterInventory(tx, entityB.playable.id, currencyItem.id, offerB.currency);
        await upsertCharacterInventory(tx, entityA.playable.id, currencyItem.id, offerB.currency);
      }
    }
  });
};

export const register = (ctx: SocketContext) => {
  const { socket } = ctx;

  // ── Trading ───────────────────────────────────────────────────────────

  socket.on("game:trade:request", async (userId, lobbyId, fromEntityId, toEntityId, payload) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const fromEntity = inst.entities.find((e) => e.id === fromEntityId);
    const toEntity = inst.entities.find((e) => e.id === toEntityId);

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

    const session: TradeSession = {
      id: sessionId,
      lobbyId,
      entityAId: fromEntityId,
      entityBId: toEntityId,
      offers: { [fromEntityId]: offerFrom, [toEntityId]: { ...EMPTY_OFFER } },
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

    const participantEntity = inst.entities.find(
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
        const fresh = await Lobby.getInstance(lobbyId);
        await update(ctx, fresh);
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

    const sessions = Array.from(activeTradeSessions.values()).filter(
      (session) =>
        session.lobbyId === lobbyId &&
        [session.entityAId, session.entityBId].some((entityId) =>
          isParticipantController(inst, userId, entityId)
        )
    );

    socket.emit("game:trade:list", sessions);
  });
};

