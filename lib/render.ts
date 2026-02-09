import * as THREE from "three";

export namespace Render {
  type PointerType = THREE.Vector3 | { x: number; y: number; z: number } | number[];

  const parseCoords = (point: PointerType) => {
    if (Array.isArray(point)) return { x: point[0], y: point[1], z: point[2] };
    return { x: point.x, y: point.y, z: point.z };
  };

  export const getTileCenter = (point: PointerType) => {
    const { x, y, z } = parseCoords(point);
    return { x: Math.floor(x) + 0.5, y: Math.floor(y) + 0.5, z: Math.floor(z) + 0.5 };
  };

  export const getTilePosition = (point: PointerType) => {
    const { x, y, z } = parseCoords(point);
    return { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
  };
}

