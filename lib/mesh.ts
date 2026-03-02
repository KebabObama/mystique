import * as THREE from "three";
import type { MeshType } from "./types/render";

/**
 * Mesh utility functions for handling 3D models from /public folder
 */
export namespace Mesh {
  let loader: THREE.Loader | null = null;
  const loadedModels = new Map<string, THREE.Group>();

  /**
   * Initialize the GLTF loader lazily
   */
  const getLoader = () => {
    if (!loader) {
      // Dynamic import to avoid issues in non-browser environments
      const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
      loader = new GLTFLoader();
    }
    return loader as any;
  };

  /**
   * Default color for each entity type
   */
  const DEFAULT_COLORS: Record<MeshType, string> = {
    character: "blue",
    monster: "red",
    chest: "#8b5a2b",
    campfire: "#ffa500",
    item: "#808080",
  };

  /**
   * Get the default color for an entity type
   */
  export const getDefaultColor = (type: MeshType): string => {
    return DEFAULT_COLORS[type];
  };

  /**
   * Get default geometry for an entity type (used when no mesh path is provided)
   */
  export const getDefaultGeometry = (type: MeshType): THREE.BufferGeometry => {
    switch (type) {
      case "chest":
        return new THREE.BoxGeometry(0.8, 0.8, 0.8);
      case "campfire":
        return new THREE.ConeGeometry(0.5, 1, 32);
      case "character":
      case "monster":
      case "item":
      default:
        return new THREE.SphereGeometry(0.4, 32, 32);
    }
  };

  /**
   * Create a default material for an entity type
   */
  export const getDefaultMaterial = (type: MeshType): THREE.Material => {
    return new THREE.MeshStandardMaterial({ color: getDefaultColor(type) });
  };

  /**
   * Validate if a mesh file path is valid
   * Checks if the path is a valid GLB or GLTF file
   */
  export const isValidMeshPath = (meshPath: string | null | undefined): boolean => {
    if (!meshPath) return false;
    const lowerPath = meshPath.toLowerCase();
    return lowerPath.endsWith(".glb") || lowerPath.endsWith(".gltf");
  };

  /**
   * Create public path from mesh path
   * If path doesn't start with /, it will be added
   */
  export const getPublicPath = (meshPath: string): string => {
    if (!meshPath.startsWith("/")) {
      return `/${meshPath}`;
    }
    return meshPath;
  };

  /**
   * Load a 3D model from the public folder
   * @param meshPath - Path to the GLB/GLTF file (relative to /public)
   * @returns Promise containing the loaded THREE.Group or null if failed
   */
  export const loadModel = async (meshPath: string): Promise<THREE.Group | null> => {
    if (!isValidMeshPath(meshPath)) {
      console.warn(`Invalid mesh path: ${meshPath}. Must be a .glb or .gltf file.`);
      return null;
    }

    // Check cache first
    if (loadedModels.has(meshPath)) {
      const cached = loadedModels.get(meshPath);
      if (cached instanceof THREE.Group) {
        return cached.clone();
      }
    }

    try {
      const publicPath = getPublicPath(meshPath);
      const loaderInstance = getLoader();
      const gltf = await new Promise<any>((resolve, reject) => {
        loaderInstance.load(
          publicPath,
          (gltf: any) => resolve(gltf),
          undefined,
          (error: any) => reject(error)
        );
      });

      // Cache the loaded model
      if (gltf.scene) {
        loadedModels.set(meshPath, gltf.scene);
        return gltf.scene.clone();
      }

      return null;
    } catch (error) {
      console.error(`Failed to load mesh: ${meshPath}`, error);
      return null;
    }
  };

  /**
   * Get the appropriate mesh for an entity
   * If meshPath is provided and valid, load that; otherwise use default shape
   */
  export const getMeshConfig = (
    type: MeshType,
    meshPath: string | null | undefined
  ): {
    type: "model" | "shape";
    geometry?: THREE.BufferGeometry;
    material?: THREE.Material;
    path?: string;
  } => {
    if (isValidMeshPath(meshPath)) {
      return { type: "model", path: meshPath! };
    }

    return {
      type: "shape",
      geometry: getDefaultGeometry(type),
      material: getDefaultMaterial(type),
    };
  };

  /**
   * Clear the mesh cache (useful for memory management)
   */
  export const clearCache = (): void => {
    loadedModels.clear();
  };

  /**
   * Get the number of cached models
   */
  export const getCacheSize = (): number => {
    return loadedModels.size;
  };

  /**
   * Remove a specific model from cache
   */
  export const clearModelFromCache = (meshPath: string): void => {
    loadedModels.delete(meshPath);
  };

  /**
   * Preload multiple meshes
   * Useful for loading meshes before they're needed
   */
  export const preloadMeshes = async (meshPaths: (string | null | undefined)[]): Promise<void> => {
    const validPaths = meshPaths.filter(isValidMeshPath) as string[];
    await Promise.all(validPaths.map((path) => loadModel(path)));
  };
}

