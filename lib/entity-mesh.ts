import { campfire, character, chest, item, monster } from "@/db/schema";
import { db } from "@/lib/db";
import { Mesh } from "@/lib/mesh";
import { eq } from "drizzle-orm";

/**
 * Entity Mesh Management Functions
 * Helper functions for creating and updating entities with custom mesh paths
 */
export namespace EntityMesh {
  /**
   * Create a new character with an optional mesh path
   * @param data - Character data
   * @param meshPath - Optional path to GLB/GLTF file in /public folder
   */
  export const createCharacter = async (data: any, meshPath?: string) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring. Will use default shape.`);
      meshPath = undefined;
    }

    return db
      .insert(character)
      .values({ ...data, meshPath: meshPath || null } as any)
      .returning();
  };

  /**
   * Create a new monster with an optional mesh path
   * @param data - Monster data
   * @param meshPath - Optional path to GLB/GLTF file in /public folder
   */
  export const createMonster = async (data: any, meshPath?: string) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring. Will use default shape.`);
      meshPath = undefined;
    }

    return db
      .insert(monster)
      .values({ ...data, meshPath: meshPath || null } as any)
      .returning();
  };

  /**
   * Create a new chest with an optional mesh path
   * @param data - Chest data
   * @param meshPath - Optional path to GLB/GLTF file in /public folder
   */
  export const createChest = async (data: any, meshPath?: string) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring. Will use default shape.`);
      meshPath = undefined;
    }

    return db
      .insert(chest)
      .values({ ...data, meshPath: meshPath || null } as any)
      .returning();
  };

  /**
   * Create a new campfire with an optional mesh path
   * @param data - Campfire data
   * @param meshPath - Optional path to GLB/GLTF file in /public folder
   */
  export const createCampfire = async (data: any, meshPath?: string) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring. Will use default shape.`);
      meshPath = undefined;
    }

    return db
      .insert(campfire)
      .values({ ...data, meshPath: meshPath || null } as any)
      .returning();
  };

  /**
   * Create a new item with an optional mesh path
   * @param data - Item data
   * @param meshPath - Optional path to GLB/GLTF file in /public folder
   */
  export const createItem = async (data: any, meshPath?: string) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring. Will use default shape.`);
      meshPath = undefined;
    }

    return db
      .insert(item)
      .values({ ...data, meshPath: meshPath || null } as any)
      .returning();
  };

  /**
   * Update a character's mesh path
   * @param characterId - Character ID
   * @param meshPath - Path to GLB/GLTF file or null to use default shape
   */
  export const updateCharacterMesh = async (characterId: string, meshPath: string | null) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring.`);
      return null;
    }

    return db
      .update(character)
      .set({ meshPath: meshPath || null })
      .where(eq(character.id, characterId))
      .returning();
  };

  /**
   * Update a monster's mesh path
   * @param monsterId - Monster ID
   * @param meshPath - Path to GLB/GLTF file or null to use default shape
   */
  export const updateMonsterMesh = async (monsterId: string, meshPath: string | null) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring.`);
      return null;
    }

    return db
      .update(monster)
      .set({ meshPath: meshPath || null })
      .where(eq(monster.id, monsterId))
      .returning();
  };

  /**
   * Update a chest's mesh path
   * @param chestId - Chest ID
   * @param meshPath - Path to GLB/GLTF file or null to use default shape
   */
  export const updateChestMesh = async (chestId: string, meshPath: string | null) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring.`);
      return null;
    }

    return db
      .update(chest)
      .set({ meshPath: meshPath || null })
      .where(eq(chest.id, chestId))
      .returning();
  };

  /**
   * Update a campfire's mesh path
   * @param campfireId - Campfire ID
   * @param meshPath - Path to GLB/GLTF file or null to use default shape
   */
  export const updateCampfireMesh = async (campfireId: string, meshPath: string | null) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring.`);
      return null;
    }

    return db
      .update(campfire)
      .set({ meshPath: meshPath || null })
      .where(eq(campfire.id, campfireId))
      .returning();
  };

  /**
   * Update an item's mesh path
   * @param itemId - Item ID
   * @param meshPath - Path to GLB/GLTF file or null to use default shape
   */
  export const updateItemMesh = async (itemId: string, meshPath: string | null) => {
    // Validate mesh path if provided
    if (meshPath && !Mesh.isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Ignoring.`);
      return null;
    }

    return db
      .update(item)
      .set({ meshPath: meshPath || null })
      .where(eq(item.id, itemId))
      .returning();
  };

  /**
   * Clear mesh path for a character (revert to default shape)
   */
  export const clearCharacterMesh = async (characterId: string) => {
    return updateCharacterMesh(characterId, null);
  };

  /**
   * Clear mesh path for a monster (revert to default shape)
   */
  export const clearMonsterMesh = async (monsterId: string) => {
    return updateMonsterMesh(monsterId, null);
  };

  /**
   * Clear mesh path for a chest (revert to default shape)
   */
  export const clearChestMesh = async (chestId: string) => {
    return updateChestMesh(chestId, null);
  };

  /**
   * Clear mesh path for a campfire (revert to default shape)
   */
  export const clearCampfireMesh = async (campfireId: string) => {
    return updateCampfireMesh(campfireId, null);
  };

  /**
   * Clear mesh path for an item (revert to default shape)
   */
  export const clearItemMesh = async (itemId: string) => {
    return updateItemMesh(itemId, null);
  };

  /**
   * Get mesh path for a character
   */
  export const getCharacterMesh = async (characterId: string) => {
    const result = await db.query.character.findFirst({
      where: eq(character.id, characterId),
      columns: { meshPath: true },
    });
    return result?.meshPath || null;
  };

  /**
   * Get mesh path for a monster
   */
  export const getMonsterMesh = async (monsterId: string) => {
    const result = await db.query.monster.findFirst({
      where: eq(monster.id, monsterId),
      columns: { meshPath: true },
    });
    return result?.meshPath || null;
  };

  /**
   * Get mesh path for a chest
   */
  export const getChestMesh = async (chestId: string) => {
    const result = await db.query.chest.findFirst({
      where: eq(chest.id, chestId),
      columns: { meshPath: true },
    });
    return result?.meshPath || null;
  };

  /**
   * Get mesh path for a campfire
   */
  export const getCampfireMesh = async (campfireId: string) => {
    const result = await db.query.campfire.findFirst({
      where: eq(campfire.id, campfireId),
      columns: { meshPath: true },
    });
    return result?.meshPath || null;
  };

  /**
   * Get mesh path for an item
   */
  export const getItemMesh = async (itemId: string) => {
    const result = await db.query.item.findFirst({
      where: eq(item.id, itemId),
      columns: { meshPath: true },
    });
    return result?.meshPath || null;
  };
}

