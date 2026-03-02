"use client";

import { Game } from "@/lib/game";
import { useCamera } from "@/lib/hooks/use-camera";
import { useGame } from "@/lib/hooks/use-game";
import { useUser } from "@/lib/hooks/use-user";
import { Mesh } from "@/lib/mesh";
import { Render } from "@/lib/render";
import { animated, useSpring } from "@react-spring/three";
import { ThreeEvent } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import * as THREE from "three";

const EntityMesh = ({
  entity,
  onOpenMenu,
}: {
  entity: Game.Entity;
  onOpenMenu: (entityId: string, event: ThreeEvent<PointerEvent>) => void;
}) => {
  const currentId = useGame((s) => s.sequence.current?.id);
  const mode = useGame((s) => s.mode);
  const target = useCamera((s) => s.camera.target);
  const tileCenter = Render.getTileCenter(entity.position);
  const userId = useUser((s) => s?.id);
  const [loadedModel, setLoadedModel] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Flattening the spring prevents the TS2589 "Excessively Deep" error
  const { x, z } = useSpring({
    x: tileCenter.x,
    z: tileCenter.z,
    config: { tension: 120, friction: 14 },
  });

  const visible = Render.distance(entity.position, target, "chebyshev") <= 25;

  const meshPath = entity.playable?.meshPath;

  useEffect(() => {
    setLoadedModel(null);
    if (!Mesh.isValidMeshPath(meshPath)) return;

    setIsLoading(true);
    Mesh.loadModel(meshPath as string)
      .then((model) => {
        setLoadedModel(model);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load mesh:", error);
        setIsLoading(false);
      });
  }, [meshPath]);

  const getColor = (): string => {
    if (entity.type === "character") {
      return entity.id === currentId && entity.playable.ownerId === userId ? "green" : "blue";
    }
    const colors: Record<string, string> = {
      monster: "red",
      chest: "#8b5a2b",
      campfire: "#ffa500",
    };
    return colors[entity.type] || "#ffffff";
  };

  const handleContextMenu = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    event.nativeEvent.preventDefault();
    if (mode.type !== "normal") return;
    onOpenMenu(entity.id, event);
  };

  // Common props for both primitive and mesh
  const animatedProps = {
    "position-x": x,
    "position-y": 0.5,
    "position-z": z,
    visible,
    "onContextMenu": handleContextMenu,
  };

  if (loadedModel && !isLoading) {
    return (
      // @ts-expect-error - React Three Fiber doesn't have built-in types for animated.primitive
      <animated.primitive
        object={loadedModel}
        position-x={x}
        position-y={0.5}
        position-z={z}
        visible={visible}
        onContextMenu={handleContextMenu}
      />
    );
  }

  return (
    <animated.mesh {...animatedProps}>
      {entity.type === "chest" ? (
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      ) : entity.type === "campfire" ? (
        <coneGeometry args={[0.5, 1, 32]} />
      ) : (
        <sphereGeometry args={[0.4, 32, 32]} />
      )}
      <meshStandardMaterial color={getColor()} />
    </animated.mesh>
  );
};

export const Entities = () => {
  const instance = useGame((s) => s.instance);
  const openAt = useGame((s) => s.entityContextMenu.openAt);

  const sortedEntities = React.useMemo(
    () =>
      instance
        ? Game.getEntities(instance)
            .slice()
            .sort((a, b) => a.id.localeCompare(b.id))
        : undefined,
    [instance]
  );

  return sortedEntities?.map((entity) => (
    <EntityMesh
      key={entity.id}
      entity={entity}
      onOpenMenu={(entityId, event) => {
        if (!instance) return;
        openAt(entityId, event.nativeEvent.clientX, event.nativeEvent.clientY);
      }}
    />
  ));
};
