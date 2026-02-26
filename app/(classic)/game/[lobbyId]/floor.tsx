"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { Render } from "@/lib/render";
import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";

const EMPTY_WALLS: any[] = [];

export const Floor = React.memo(() => {
  const wallsRef = React.useRef<THREE.InstancedMesh>(null);
  const wallDummy = React.useMemo(() => new THREE.Object3D(), []);

  const target = useCamera((s) => s.camera.target);
  const walls = useGame((s) => s.instance?.data.walls ?? EMPTY_WALLS);

  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const addChestAt = useGame((s) => s.chest.addAt);
  const moveChestTo = useGame((s) => s.chest.moveTo);
  const addMonsterAt = useGame((s) => s.monster.addAt);
  const addWallAt = useGame((s) => s.wall.addAt);
  const deleteWallAt = useGame((s) => s.wall.deleteAt);
  const addWallArea = useGame((s) => s.wall.addArea);
  const deleteWallArea = useGame((s) => s.wall.deleteArea);
  const current = useGame((s) => s.sequence.current);
  const moveTo = useGame((s) => s.movement.moveTo);
  const castAbility = useGame((s) => s.abilities.useAt);

  const ability = mode.type === "ability" ? mode.ability : undefined;
  const actions =
    current?.actions ??
    (current && current.type !== "chest" ? current.playable.maxActions : 0) ??
    0;

  const position = Render.getTilePosition(target);

  const [hoverPos, setHoverPos] = React.useState<{ x: number; z: number } | null>(null);

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    const point = Render.getTilePosition(e.point);

    switch (mode.type) {
      case "monster:place":
        addMonsterAt(mode.monsterId, { x: point.x, z: point.z });
        setMode({ type: "normal" });
        break;
      case "chest:place":
        addChestAt({ x: point.x, z: point.z });
        setMode({ type: "normal" });
        break;
      case "chest:move":
        moveChestTo(mode.entityId, { x: point.x, z: point.z });
        setMode({ type: "normal" });
        break;
      case "wall:place":
        addWallAt(Render.getTilePosition(point));
        break;
      case "wall:place-area":
        if (!mode.start) {
          setMode({ type: "wall:place-area", start: { x: point.x, z: point.z } });
        } else {
          addWallArea(mode.start, { x: point.x, z: point.z });
          setMode({ type: "normal" });
        }
        break;
      case "wall:destroy-area":
        if (!mode.start) {
          setMode({ type: "wall:destroy-area", start: { x: point.x, z: point.z } });
        } else {
          deleteWallArea(mode.start, { x: point.x, z: point.z });
          setMode({ type: "normal" });
        }
        break;
      default:
        if (ability && current && actions > 0) castAbility({ x: point.x, z: point.z });
        break;
    }
  };

  const handleFloorMove = (e: ThreeEvent<PointerEvent>) => {
    if (mode.type === "wall:place-area" || mode.type === "wall:destroy-area") {
      const point = Render.getTilePosition(e.point);
      setHoverPos({ x: point.x, z: point.z });
    }
  };

  const areaStart =
    mode.type === "wall:place-area" || mode.type === "wall:destroy-area" ? mode.start : undefined;
  const areaPreview = React.useMemo(() => {
    const corner = areaStart;
    const hover = hoverPos;
    if (!corner || !hover) return [];
    const minX = Math.min(corner.x, hover.x);
    const maxX = Math.max(corner.x, hover.x);
    const minZ = Math.min(corner.z, hover.z);
    const maxZ = Math.max(corner.z, hover.z);
    const tiles: { x: number; z: number }[] = [];
    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        tiles.push({ x, z });
      }
    }
    return tiles;
  }, [areaStart, hoverPos]);

  const viable = React.useMemo(() => {
    if (!current) return [];
    return useGame.getState().movement.getViable(current.id);
  }, [current]);

  const viableAbility = React.useMemo(() => {
    if (!current || !ability) return [];
    return useGame.getState().abilities.getViable(current.id, ability);
  }, [current, ability]);

  React.useLayoutEffect(() => {
    const mesh = wallsRef.current;
    if (!mesh) return;

    for (let index = 0; index < walls.length; index++) {
      const wall = walls[index];
      wallDummy.position.set(wall.x + 0.5, 1, wall.z + 0.5);
      wallDummy.updateMatrix();
      mesh.setMatrixAt(index, wallDummy.matrix);
    }

    mesh.count = walls.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [walls, wallDummy]);

  const handleWallClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const index = e.instanceId;
    const point = Render.getTilePosition(e.point);
    switch (mode.type) {
      case "wall:place":
        addWallAt(point);
        break;
      case "wall:destroy":
        if (index !== undefined && walls[index]) {
          deleteWallAt(walls[index]);
        } else deleteWallAt(point);
        break;
      default:
        handleFloorClick(e);
        break;
    }
  };

  return (
    <>
      <Plane
        onClick={handleFloorClick}
        onPointerMove={handleFloorMove}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position.x, position.y, position.z]}
        scale={50}
      />

      {mode.type === "character:move" &&
        viable.map((pos, i) => (
          <Plane
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (current && actions > 0) {
                moveTo(current.id, pos);
                setMode({ type: "normal" });
              }
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[pos.x + 0.5, position.y + 0.01, pos.z + 0.5]}
            scale={0.9}
          >
            <meshBasicMaterial color="green" transparent opacity={0.5} />
          </Plane>
        ))}

      {ability &&
        viableAbility.map((pos, i) => (
          <Plane
            key={`ability-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!current || actions <= 0) return;
              castAbility(pos);
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[pos.x + 0.5, position.y + 0.015, pos.z + 0.5]}
            scale={0.9}
          >
            <meshBasicMaterial color="orange" transparent opacity={0.35} />
          </Plane>
        ))}

      {ability && (
        <Plane
          onClick={() => setMode({ type: "normal" })}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[position.x, position.y + 0.001, position.z]}
          scale={60}
        >
          <meshBasicMaterial transparent opacity={0} />
        </Plane>
      )}

      {areaPreview.length > 0 &&
        areaPreview.map((pos, i) => (
          <Plane
            key={`area-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[pos.x + 0.5, position.y + 0.02, pos.z + 0.5]}
            scale={0.9}
          >
            <meshBasicMaterial
              color={mode.type === "wall:destroy-area" ? "red" : "cyan"}
              transparent
              opacity={0.4}
            />
          </Plane>
        ))}

      <gridHelper args={[50, 50, "#444444"]} position={[position.x, position.y, position.z]} />

      <instancedMesh ref={wallsRef} args={[undefined, undefined, 1000]} onClick={handleWallClick}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#6b7280" />
      </instancedMesh>
    </>
  );
});
