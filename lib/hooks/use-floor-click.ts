import { ThreeEvent } from "@react-three/fiber";
import { create } from "zustand";

export type FloorClickCallback = (
  e: ThreeEvent<MouseEvent>,
  point: { x: number; z: number }
) => void;
export type WallClickCallback = (
  e: ThreeEvent<MouseEvent>,
  point: { x: number; z: number },
  instanceId?: number
) => void;

type FloorClickStore = {
  floorClickCallbacks: FloorClickCallback[];
  wallClickCallbacks: WallClickCallback[];

  // Floor click actions
  addFloorClickCallback: (callback: FloorClickCallback) => void;
  removeFloorClickCallback: (callback: FloorClickCallback) => void;
  emitFloorClick: (e: ThreeEvent<MouseEvent>, point: { x: number; z: number }) => void;

  // Wall click actions
  addWallClickCallback: (callback: WallClickCallback) => void;
  removeWallClickCallback: (callback: WallClickCallback) => void;
  emitWallClick: (
    e: ThreeEvent<MouseEvent>,
    point: { x: number; z: number },
    instanceId?: number
  ) => void;
};

export const useFloorClick = create<FloorClickStore>((set, get) => ({
  floorClickCallbacks: [],
  wallClickCallbacks: [],

  addFloorClickCallback: (callback) =>
    set((state) => ({ floorClickCallbacks: [...state.floorClickCallbacks, callback] })),

  removeFloorClickCallback: (callback) =>
    set((state) => ({
      floorClickCallbacks: state.floorClickCallbacks.filter((cb) => cb !== callback),
    })),

  emitFloorClick: (e, point) => {
    const callbacks = get().floorClickCallbacks;
    callbacks.forEach((callback) => callback(e, point));
  },

  addWallClickCallback: (callback) =>
    set((state) => ({ wallClickCallbacks: [...state.wallClickCallbacks, callback] })),

  removeWallClickCallback: (callback) =>
    set((state) => ({
      wallClickCallbacks: state.wallClickCallbacks.filter((cb) => cb !== callback),
    })),

  emitWallClick: (e, point, instanceId) => {
    const callbacks = get().wallClickCallbacks;
    callbacks.forEach((callback) => callback(e, point, instanceId));
  },
}));

