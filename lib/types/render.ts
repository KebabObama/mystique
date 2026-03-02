import * as THREE from "three";

export type RenderPointerType =
  | THREE.Vector3
  | { x: number; y?: number | null; z: number }
  | number[];

export type RenderDistanceType = "euclidean" | "manhattan" | "chebyshev";
