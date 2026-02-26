"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { Game } from "@/lib/game";
import { Render } from "@/lib/render";
import { animated, useSpring } from "@react-spring/three";
import React from "react";

const EntityMesh = ({
  entity,
  onOpenInventory,
}: {
  entity: Game.Entity;
  onOpenInventory: (entityId: string) => void;
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
      onClick={() => {
        if (mode.type !== "normal") return;
        onOpenInventory(entity.id);
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
  const openPanel = useGame((s) => s.inventory.openPanel);
  const isOnMasterTurn = useGame((s) => s.sequence.isOnMasterTurn);
  const isUsersEntity = useGame((s) => s.isUsersEntity);
  const userId = useUser((s) => s?.id);

  const sortedEntities = React.useMemo(
    () => instance?.entities.slice().sort((a, b) => a.id.localeCompare(b.id)),
    [instance?.entities]
  );

  return sortedEntities?.map((entity) => (
    <EntityMesh
      key={entity.id}
      entity={entity}
      onOpenInventory={(entityId) => {
        if (!instance || !userId) return;
        const targetEntity = instance.entities.find((entry) => entry.id === entityId);
        if (!targetEntity) return;

        if (isOnMasterTurn) {
          openPanel("master", entityId);
          return;
        }

        switch (targetEntity.type) {
          case "character": {
            const isOwnAndActive = isUsersEntity(targetEntity);
            openPanel(isOwnAndActive ? "view" : "inspect", entityId);
            return;
          }

          case "chest": {
            const nearbyOwnCharacter = instance.entities.find(
              (e) =>
                e.type === "character" &&
                isUsersEntity(targetEntity) &&
                Render.distance(e.position, targetEntity.position, "manhattan") <= 1
            );
            if (!nearbyOwnCharacter) return;
            openPanel("storage", entityId, nearbyOwnCharacter.id);
            return;
          }

          case "monster":
          default:
            return;
        }
      }}
    />
  ));
};
