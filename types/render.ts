import { ColorRepresentation, Vector3 } from "three";

export namespace Render {
  export type GridPosition = [x: number, z: number];
  export type WorldPosition = Vector3;

  export type TileEventCallback = (
    gridPos: GridPosition,
    worldPos: WorldPosition,
    tileId: string
  ) => void;

  export type ColorPattern = (x: number, z: number) => ColorRepresentation;
  export type TileType = string | number;

  export type TileData = {
    id: string;
    position: GridPosition;
    type?: TileType;
    color?: ColorRepresentation;
    rotation?: number;
    metadata?: Record<string, any>;
  };

  export type BaseTile = {
    size?: number;
    height?: number;
    color?: ColorRepresentation;
    opacity?: number;
    roughness?: number;
    metalness?: number;
    wireframe?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
  };

  export type InteractiveTileProps = BaseTile & {
    onClick?: TileEventCallback;
    onPointerOver?: TileEventCallback;
    onPointerLeave?: TileEventCallback;
    onPointerDown?: TileEventCallback;
    onPointerUp?: TileEventCallback;
  };

  export type FloorProps = {
    width?: number;
    depth?: number;
    tileSize?: number;
    tileHeight?: number;
    centerGrid?: boolean;
    offset?: [x: number, z: number];
    tileProps?: Partial<InteractiveTileProps>;
    customTiles?: TileData[];
    colorPattern?: ColorPattern;
    onTileClick?: TileEventCallback;
    onTileHover?: TileEventCallback;
    onTileLeave?: TileEventCallback;
    selectedTiles?: GridPosition[];
    hoveredTiles?: GridPosition[];
    showGridLines?: boolean;
    gridLineColor?: ColorRepresentation;
    gridLineWidth?: number;
    visible?: boolean;
    autoCenter?: boolean;
  };
}

