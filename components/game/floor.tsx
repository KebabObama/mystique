import type { Render } from "@/types/render";
import { memo, useMemo } from "react";
import * as THREE from "three";
import { Tile } from "./tile";

const FloorComponent = ({
  width = 10,
  depth = 10,
  tileSize = 1,
  tileHeight = 0.1,
  centerGrid = true,
  offset = [0, 0],
  tileProps = {},
  customTiles,
  colorPattern,
  onTileClick,
  selectedTiles = [],
  hoveredTiles = [],
  visible = true,
  autoCenter = false,
  ...groupProps
}: Render.FloorProps) => {
  if (!visible) return null;

  const { startX, startZ, offsetX, offsetZ, widthDepth } = useMemo(
    () => ({
      startX: centerGrid ? -Math.floor(width / 2) : 0,
      startZ: centerGrid ? -Math.floor(depth / 2) : 0,
      offsetX: offset[0],
      offsetZ: offset[1],
      widthDepth: width * depth,
    }),
    [width, depth, centerGrid, offset]
  );

  // Fast lookup maps with string keys
  const [selectedMap, hoveredMap] = useMemo(
    () => [
      new Map(selectedTiles.map(([x, z]) => [`${x}:${z}`, true])),
      new Map(hoveredTiles.map(([x, z]) => [`${x}:${z}`, true])),
    ],
    [selectedTiles, hoveredTiles]
  );

  // Generate tiles with minimal allocations
  const tiles = useMemo(() => {
    if (customTiles) return customTiles;
    const result: Render.TileData[] = new Array(widthDepth);
    let idx = 0;
    for (let x = 0; x < width; x++) {
      const gridX = startX + x + offsetX;
      for (let z = 0; z < depth; z++) {
        const gridZ = startZ + z + offsetZ;
        let color: string;
        if (colorPattern) {
          const patternColor = colorPattern(gridX, gridZ);
          color =
            typeof patternColor === "string"
              ? patternColor
              : `#${patternColor.toString(16).padStart(6, "0")}`;
        } else {
          color = (gridX + gridZ) & 1 ? "#888888" : "#666666";
        }

        result[idx++] = {
          id: `tile-${gridX}-${gridZ}`,
          position: [gridX, gridZ] as Render.GridPosition,
          color,
          metadata: { x: gridX, z: gridZ },
        };
      }
    }

    return result;
  }, [
    customTiles,
    width,
    depth,
    startX,
    startZ,
    offsetX,
    offsetZ,
    widthDepth,
    colorPattern,
    selectedMap,
    hoveredMap,
  ]);

  // Optimized click handler - properly typed
  const handleTileClick = useMemo(
    () =>
      onTileClick
        ? (gridPos: Render.GridPosition, worldPos: THREE.Vector3, tileId: string) => {
            onTileClick(gridPos, worldPos, tileId);
          }
        : undefined,
    [onTileClick]
  );

  // Optimized center position - properly typed as [x, y, z]
  const centerPosition = useMemo(
    () =>
      autoCenter
        ? ([-((width - 1) * tileSize) / 2, 0, -((depth - 1) * tileSize) / 2] as [
            number,
            number,
            number,
          ])
        : ([0, 0, 0] as [number, number, number]),
    [width, depth, tileSize, autoCenter]
  );

  const sharedTileProps = useMemo(
    () => ({ size: tileSize, height: tileHeight, onClick: handleTileClick, ...tileProps }),
    [
      tileSize,
      tileHeight,
      handleTileClick,
      tileProps.opacity,
      tileProps.roughness,
      tileProps.metalness,
      tileProps.wireframe,
      tileProps.castShadow,
      tileProps.receiveShadow,
      tileProps.color,
    ]
  );

  return (
    <group castShadow name="floor" {...groupProps} position={centerPosition}>
      {tiles.map((tile) => (
        <Tile
          receiveShadow
          key={tile.id}
          gridPosition={tile.position}
          tileId={tile.id}
          color={tile.color}
          {...sharedTileProps}
        />
      ))}
    </group>
  );
};

export const Floor = memo(FloorComponent, (prev, next) => {
  if (!prev.visible && !next.visible) return true;
  if (prev.visible !== next.visible) return false;
  if (
    prev.width !== next.width ||
    prev.depth !== next.depth ||
    prev.tileSize !== next.tileSize ||
    prev.tileHeight !== next.tileHeight ||
    prev.centerGrid !== next.centerGrid ||
    prev.autoCenter !== next.autoCenter
  )
    return false;
  if (
    prev.customTiles !== next.customTiles ||
    prev.colorPattern !== next.colorPattern ||
    prev.onTileClick !== next.onTileClick
  )
    return false;
  if (prev.offset?.[0] !== next.offset?.[0] || prev.offset?.[1] !== next.offset?.[1]) return false;
  if (prev.tileProps !== next.tileProps) return false;
  if (prev.selectedTiles !== next.selectedTiles) return false;
  if (prev.hoveredTiles !== next.hoveredTiles) return false;

  return true;
});

