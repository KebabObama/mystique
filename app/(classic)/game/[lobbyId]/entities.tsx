"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { Game } from "@/lib/game";
import { Render } from "@/lib/render";
import { animated, useSpring } from "@react-spring/three";
import React from "react";

const EntityMesh = ({ entity }: { entity: Game.Entity }) => {
  const target = useCamera((s) => s.camera.target);
  const tileCenter = Render.getTileCenter(entity.position);
  const { position } = useSpring({
    position: [tileCenter.x, 0.5, tileCenter.z],
    config: { tension: 120, friction: 14 },
  });

  const visible = Render.distance(entity.position, target, "chebyshev") <= 25;
  const color = entity.type === "character" ? "blue" : "red";

  return (
    <animated.mesh position={position as any} visible={visible}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  );
};

export const Entities = () => {
  const instance = useGame((s) => s.instance);

  const sortedEntities = React.useMemo(
    () => instance?.entities.slice().sort((a, b) => a.id.localeCompare(b.id)),
    [instance?.entities]
  );

  return sortedEntities?.map((entity) => <EntityMesh key={entity.id} entity={entity} />);
};
