import * as THREE from "three";

export namespace Render {
  export const getTileCenter = (point: THREE.Vector3) => {
    const centerX = Math.floor(point.x) + 0.5;
    const centerY = Math.floor(point.y) + 0.5;
    const centerZ = Math.floor(point.z) + 0.5;
    return { x: centerX, y: centerY, z: centerZ };
  };

  export const getTilePosition = (point: THREE.Vector3) => {
    const positionX = Math.floor(point.x);
    const positionY = Math.floor(point.y);
    const positionZ = Math.floor(point.z);
    return { x: positionX, y: positionY, z: positionZ };
  };
}
