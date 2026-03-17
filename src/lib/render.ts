import type { RenderDistanceType, RenderPointerType } from "@/lib/types";

export namespace Render {
  export type PointerType = RenderPointerType;
  export type DistanceType = RenderDistanceType;

  const parseCoords = (point: PointerType) => {
    if (Array.isArray(point)) return { x: point[0] ?? 0, y: point[1] ?? 0, z: point[2] ?? 0 };
    return { x: point.x ?? 0, y: point.y ?? 0, z: point.z ?? 0 };
  };

  export const getTileCenter = (point: PointerType) => {
    const { x, y, z } = parseCoords(point);
    return { x: Math.floor(x) + 0.5, y: Math.floor(y) + 0.5, z: Math.floor(z) + 0.5 };
  };

  export const getTilePosition = (point: PointerType) => {
    const { x, y, z } = parseCoords(point);
    return { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
  };

  export const distance = (a: PointerType, b: PointerType, type: DistanceType = "euclidean") => {
    const p1 = parseCoords(a);
    const p2 = parseCoords(b);

    const dx = Math.abs(p1.x - p2.x);
    const dy = Math.abs(p1.y - p2.y);
    const dz = Math.abs(p1.z - p2.z);

    switch (type) {
      case "manhattan":
        return dx + dy + dz;
      case "chebyshev":
        return Math.max(dx, dy, dz);
      case "euclidean":
      default:
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
  };
}
