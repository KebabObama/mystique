"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { Game } from "@/lib/game";
import { Render } from "@/lib/render";
import { animated, useSpring } from "@react-spring/three";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

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
  const { position } = useSpring({
    position: [tileCenter.x, 0.5, tileCenter.z],
    config: { tension: 120, friction: 14 },
  });

  const visible = Render.distance(entity.position, target, "chebyshev") <= 25;
  const color =
    entity.type === "character"
      ? entity.id === currentId && entity.playable.ownerId === userId
        ? "green"
        : "blue"
      : entity.type === "monster"
        ? "red"
        : "#8b5a2b";

  return (
    <animated.mesh
      position={position as any}
      visible={visible}
      onContextMenu={(event) => {
        event.stopPropagation();
        event.nativeEvent.preventDefault();
        if (mode.type !== "normal") return;
        onOpenMenu(entity.id, event as ThreeEvent<PointerEvent>);
      }}
    >
      {entity.type === "chest" ? (
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      ) : (
        <sphereGeometry args={[0.4, 32, 32]} />
      )}
      <meshStandardMaterial color={color} />
    </animated.mesh>
  );
};

export const Entities = () => {
  const instance = useGame((s) => s.instance);
  const openAt = useGame((s) => s.entityContextMenu.openAt);

  const sortedEntities = React.useMemo(
    () => instance?.entities.slice().sort((a, b) => a.id.localeCompare(b.id)),
    [instance?.entities]
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
