import { db, schema } from "@/lib/db";
import { Game } from "@/lib/game";
import * as Lobby from "@/lib/lobby";
import { eq } from "drizzle-orm";
import { type SocketContext, exists, update } from "./helpers";

export const register = (ctx: SocketContext) => {
  const { socket } = ctx;

  // ── Level Up ──────────────────────────────────────────────────────────

  socket.on("game:character:levelup", async (userId, lobbyId, characterId, attributePoints) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;

    const character = await db.query.character.findFirst({
      where: eq(schema.character.id, characterId),
      with: { inventory: { with: { item: true } } },
    });

    if (!character) return;
    if (character.ownerId !== userId && inst.masterId !== userId) return;

    // Validate attribute points (should be object with up to 5 total points distributed)
    if (typeof attributePoints !== "object" || !attributePoints) return;

    let totalPointsSpent = 0;
    const newAttributes = { ...character.attributes };

    for (const attr of Game.ATTRIBUTES) {
      const points = attributePoints[attr] ?? 0;
      if (typeof points !== "number" || points < 0) return;
      totalPointsSpent += points;
      newAttributes[attr] = character.attributes[attr] + points;
    }

    // Enforce exactly 5 attribute points
    if (totalPointsSpent !== 5) return;

    // Recalculate stats with new attributes
    const inventory = {
      weight: character.inventory.reduce((sum, inv) => sum + (inv.item.weight ?? 0), 0),
      armor: character.inventory.reduce((sum, inv) => sum + (inv.item.armor ?? 0), 0),
    };

    const stats = Game.calculateCharacterStats(
      { ...character, level: character.level, attributes: newAttributes },
      inventory
    );

    // Update character
    await db
      .update(schema.character)
      .set({
        level: character.level + 1,
        attributes: newAttributes,
        maxHp: stats.maxHp,
        maxActions: stats.maxActions,
        stamina: stats.stamina,
        maxWeight: stats.maxWeight,
        maxMemory: stats.maxMemory,
        hp: stats.maxHp, // Full heal on level up
      })
      .where(eq(schema.character.id, characterId));

    const fresh = await Lobby.getInstance(lobbyId);
    await update(ctx, fresh, "game:character:levelup:complete");
  });

  // ── Get XP Requirements ───────────────────────────────────────────────

  socket.on("game:character:xp:info", async (userId, lobbyId, characterId) => {
    const character = await db.query.character.findFirst({
      where: eq(schema.character.id, characterId),
    });

    if (!character) return;

    const xpToNextLevel = Math.floor(100 * Math.pow(1.1, character.level - 1));
    const xpProgress = character.xp;

    socket.emit("game:character:xp:info", {
      currentLevel: character.level,
      currentXp: xpProgress,
      xpToNextLevel,
      nextLevelAt: xpToNextLevel,
      canLevelUp: character.xp >= xpToNextLevel,
    });
  });

  // ── Award XP ──────────────────────────────────────────────────────────

  socket.on("game:character:xp:award", async (userId, lobbyId, characterId, amount) => {
    const inst = await exists(ctx, userId, lobbyId);
    if (!inst) return;
    if (inst.masterId !== userId) return;

    const character = await db.query.character.findFirst({
      where: eq(schema.character.id, characterId),
    });

    if (!character) return;

    const xpAmount = Math.max(0, Math.floor(amount));
    const newXp = character.xp + xpAmount;

    await db
      .update(schema.character)
      .set({ xp: newXp })
      .where(eq(schema.character.id, characterId));

    const fresh = await Lobby.getInstance(lobbyId);
    await update(ctx, fresh, "game:character:xp:awarded");
  });
};

