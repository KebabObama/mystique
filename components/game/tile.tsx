import type { Render } from "@/types/render";
import { useMemo } from "react";
import * as THREE from "three";

type TileComponentProps = Render.InteractiveTileProps & {
  gridPosition: Render.GridPosition;
  tileId: string;
};

export const Tile = ({
  gridPosition: [gridX, gridZ],
  tileId,
  size = 1,
  height = 0.1,
  color = "#888888",
  opacity = 1,
  roughness = 0.8,
  metalness = 0.2,
  wireframe = false,
  castShadow = true,
  receiveShadow = true,
  onClick,
  onPointerOver,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
}: TileComponentProps) => {
  const { meshPosition, geometryArgs } = useMemo(() => {
    const worldX = gridX * size;
    const worldZ = gridZ * size;
    return {
      meshPosition: [worldX, height / 2, worldZ] as [number, number, number],
      geometryArgs: [size, height, size] as const,
      worldPosition: new THREE.Vector3(worldX, 0, worldZ),
    };
  }, [gridX, gridZ, size, height]);

  const eventHandlers = useMemo(() => {
    const worldPos = new THREE.Vector3(gridX * size, 0, gridZ * size);
    const createHandler = (handler?: (...args: any[]) => void) =>
      handler ? () => handler([gridX, gridZ], worldPos, tileId) : undefined;
    return {
      onClick: createHandler(onClick),
      onPointerOver: createHandler(onPointerOver),
      onPointerLeave: createHandler(onPointerLeave),
      onPointerDown: createHandler(onPointerDown),
      onPointerUp: createHandler(onPointerUp),
    };
  }, [
    gridX,
    gridZ,
    size,
    tileId,
    onClick,
    onPointerOver,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
  ]);

  return (
    <mesh
      position={meshPosition}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      {...eventHandlers}
    >
      <boxGeometry args={geometryArgs} />
      <meshStandardMaterial
        color={color}
        opacity={opacity}
        transparent={opacity < 1}
        roughness={roughness}
        metalness={metalness}
        wireframe={wireframe}
      />
    </mesh>
  );
};

