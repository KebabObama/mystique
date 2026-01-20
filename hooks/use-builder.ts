import { Render } from "@/lib/render";
import * as THREE from "three";
import { create } from "zustand";

export const TOOLS = ["build", "delete"] as const;
export const SELECTION_MODES = ["single", "area"] as const;

export type Tool = (typeof TOOLS)[number];
export type SelectionMode = (typeof SELECTION_MODES)[number];
export type Block = { id: string; position: [number, number, number]; color: string };

type BuilderState = {
  blocks: Block[];
  tool: Tool;
  selectionMode: SelectionMode;
  firstPoint: [number, number, number] | null;
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
  color: "#000000",

  setColor: (c) => set({ color: c }),
  setTool: (tool) => set({ tool, firstPoint: null }),
  setSelectionMode: (selectionMode) => set({ selectionMode, firstPoint: null }),
  clearBlocks: () => set({ blocks: [] }),
  buildAction: (point, normal) => {
    const { tool, selectionMode, firstPoint, blocks, color } = get();
    const offset = tool === "build" ? 0.1 : -0.1;
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

    const existingSet = new Set(nextBlocks.map((b) => `${b.position.join(",")}`));

    if (tool === "build") {
      for (let ix = minX; ix <= maxX; ix++) {
        for (let iy = minY; iy <= maxY; iy++) {
          for (let iz = minZ; iz <= maxZ; iz++) {
            const posKey = `${ix + 0.5},${iy + 0.5},${iz + 0.5}`;
            if (!existingSet.has(posKey)) {
              nextBlocks.push({
                id: crypto.randomUUID(),
                position: [ix + 0.5, iy + 0.5, iz + 0.5],
                color,
              });
              existingSet.add(posKey);
            }
          }
        }
      }
    } else if (tool === "delete") {
      nextBlocks = nextBlocks.filter((b) => {
        const [bx, by, bz] = b.position;
        const inX = bx >= minX && bx <= maxX + 1;
        const inY = by >= minY && by <= maxY + 1;
        const inZ = bz >= minZ && bz <= maxZ + 1;
        return !(inX && inY && inZ);
      });
    }

    set({ blocks: nextBlocks, firstPoint: null });
  },
}));
