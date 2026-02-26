"use client";

import { useCamera } from "@/hooks/use-camera";
import { useGame } from "@/hooks/use-game";
import { Render } from "@/lib/render";
import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React from "react";

export const Floor = React.memo(() => {
  const target = useCamera((s) => s.camera.target);
  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const addChestAt = useGame((s) => s.chest.addAt);
  const moveChestTo = useGame((s) => s.chest.moveTo);
  const addMonsterAt = useGame((s) => s.monster.addAt);
  const current = useGame((s) => s.sequence.current);
  const moveTo = useGame((s) => s.movement.moveTo);
  const castAbility = useGame((s) => s.abilities.useAt);
  const ability = mode.type === "ability" ? mode.ability : undefined;
  const actions =
    current?.actions ??
    (current && current.type !== "chest" ? current.playable.maxActions : 0) ??
    0;

  const position = Render.getTilePosition(target);

  const handle = (e: ThreeEvent<MouseEvent>) => {
    const point = Render.getTilePosition(e.point);
    if (mode.type === "monster:place") {
      addMonsterAt(mode.monsterId, { x: point.x, z: point.z });
      setMode({ type: "normal" });
      return;
    }
    if (mode.type === "chest:place") {
      addChestAt({ x: point.x, z: point.z });
      setMode({ type: "normal" });
      return;
    }
    if (mode.type === "chest:move") {
      moveChestTo(mode.entityId, { x: point.x, z: point.z });
      setMode({ type: "normal" });
      return;
    }
    if (ability && current && actions > 0) castAbility({ x: point.x, z: point.z });
  };

  const viable = React.useMemo(() => {
    if (!current) return [];
    return useGame.getState().movement.getViable(current.id);
  }, [current]);

  const viableAbility = React.useMemo(() => {
    if (!current || !ability) return [];
    return useGame.getState().abilities.getViable(current.id, ability);
  }, [current, ability]);

  return (
    <>
      <Plane
        onClick={handle}
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

      <gridHelper args={[50, 50, "#444444"]} position={[position.x, position.y, position.z]} />
    </>
  );
});
