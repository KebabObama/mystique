import { Render } from "@/lib/render";
import * as THREE from "three";
import { create } from "zustand";

export const TOOLS = ["build", "delete", "move"] as const;
export const SELECTION_MODES = ["single", "area"] as const;

export type Tool = (typeof TOOLS)[number];
export type SelectionMode = (typeof SELECTION_MODES)[number];
type Block = { id: string; position: [number, number, number]; color: string };

type BuilderState = {
  blocks: Block[];
  tool: Tool;
  selectionMode: SelectionMode;
  firstPoint: [number, number, number] | null;
  moveSource: [number, number, number] | null;
  color: string;
  setColor(color: string): void;
  setTool: (tool: Tool) => void;
  setSelectionMode: (mode: SelectionMode) => void;
  clearBlocks: () => void;
  buildAction: (point: THREE.Vector3, normal: THREE.Vector3) => void;
};

export const useBuilder = create<BuilderState>((set, get) => ({
  blocks: [],
  tool: "build",
  selectionMode: "single",
  firstPoint: null,
  moveSource: null,
  color: "#000000",

  setColor: (c) => set({ color: c }),
  setTool: (tool) => set({ tool, firstPoint: null, moveSource: null }),
  setSelectionMode: (selectionMode) => set({ selectionMode, firstPoint: null }),
  clearBlocks: () => set({ blocks: [] }),
  buildAction: (point, normal) => {
    const { tool, selectionMode, firstPoint, blocks, moveSource } = get();
    const isBuilding = tool === "build";
    const offset = isBuilding ? 0.1 : -0.1;
    const adjPoint = point.clone().add(normal.clone().multiplyScalar(offset));
    const { x, y, z } = Render.getTilePosition(adjPoint);

    if (selectionMode === "area" && !firstPoint) {
      set({ firstPoint: [x, y, z] });
      return;
    }

    const p1 = firstPoint || [x, y, z];
    const p2 = [x, y, z];
    const minX = Math.min(p1[0], p2[0]),
      maxX = Math.max(p1[0], p2[0]);
    const minY = Math.min(p1[1], p2[1]),
      maxY = Math.max(p1[1], p2[1]);
    const minZ = Math.min(p1[2], p2[2]),
      maxZ = Math.max(p1[2], p2[2]);

    let nextBlocks = [...blocks];

    // --- TOOL: BUILD ---
    if (tool === "build") {
      for (let ix = minX; ix <= maxX; ix++) {
        for (let iy = minY; iy <= maxY; iy++) {
          for (let iz = minZ; iz <= maxZ; iz++) {
            const pos: [number, number, number] = [ix + 0.5, iy + 0.5, iz + 0.5];
            if (
              !nextBlocks.some(
                (b) =>
                  b.position[0] === pos[0] && b.position[1] === pos[1] && b.position[2] === pos[2]
              )
            ) {
              nextBlocks.push({ id: crypto.randomUUID(), position: pos, color: get().color });
            }
          }
        }
      }
    }

    // --- TOOL: DELETE ---
    else if (tool === "delete") {
      nextBlocks = nextBlocks.filter((b) => {
        const inVolume =
          b.position[0] >= minX &&
          b.position[0] <= maxX + 1 &&
          b.position[1] >= minY &&
          b.position[1] <= maxY + 1 &&
          b.position[2] >= minZ &&
          b.position[2] <= maxZ + 1;
        return !inVolume;
      });
    }

    // --- TOOL: MOVE ---
    else if (tool === "move") {
      if (!moveSource) {
        set({ moveSource: [x, y, z] });
        return;
      } else {
        const dx = x - moveSource[0];
        const dy = y - moveSource[1];
        const dz = z - moveSource[2];

        nextBlocks = nextBlocks.map((b) => {
          const inVolume =
            b.position[0] >= minX &&
            b.position[0] <= maxX + 1 &&
            b.position[1] >= minY &&
            b.position[1] <= maxY + 1 &&
            b.position[2] >= minZ &&
            b.position[2] <= maxZ + 1;

          if (inVolume) {
            return { ...b, position: [b.position[0] + dx, b.position[1] + dy, b.position[2] + dz] };
          }
          return b;
        });
        set({ moveSource: null });
      }
    }

    set({ blocks: nextBlocks, firstPoint: null });
  },
}));

