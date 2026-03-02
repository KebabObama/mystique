import * as THREE from "three";

export type RenderPointerType =
  | THREE.Vector3
  | { x: number; y?: number | null; z: number }
  | number[];

export type RenderDistanceType = "euclidean" | "manhattan" | "chebyshev";

export type MeshType = "character" | "monster" | "chest" | "campfire" | "item";

export interface MeshConfig {
  type: MeshType;
  meshPath?: string | null;
}

export interface MeshGeometry {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
}
