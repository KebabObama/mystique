"use client";

import { Context } from "@/components/ui/context";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { Render } from "@/lib/render";
import React from "react";

type MenuAction = { label: string; run: () => void };

export const EntityContextMenu = () => {
  const instance = useGame((s) => s.instance);
  const isOnMasterTurn = useGame((s) => s.sequence.isOnMasterTurn);
  const isUsersEntity = useGame((s) => s.isUsersEntity);
  const openPanel = useGame((s) => s.inventory.openPanel);

  const open = useGame((s) => s.entityContextMenu.open);
  const entityId = useGame((s) => s.entityContextMenu.entityId);
  const x = useGame((s) => s.entityContextMenu.x);
  const y = useGame((s) => s.entityContextMenu.y);
  const close = useGame((s) => s.entityContextMenu.close);

  const userId = useUser((s) => s?.id);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const actions = React.useMemo<MenuAction[]>(() => {
    if (!instance || !userId || !entityId) return [];

    const targetEntity = instance.entities.find((entry) => entry.id === entityId);
    if (!targetEntity) return [];

    if (isOnMasterTurn) {
      return [{ label: "Open inventory", run: () => openPanel("master", targetEntity.id) }];
    }

    switch (targetEntity.type) {
      case "character": {
        const isOwnAndActive = isUsersEntity(targetEntity);
        return [
          {
            label: isOwnAndActive ? "Open inventory" : "Inspect",
            run: () => openPanel(isOwnAndActive ? "view" : "inspect", targetEntity.id),
          },
        ];
      }

      case "chest": {
        const nearbyOwnCharacter = instance.entities.find(
          (entry) =>
            entry.type === "character" &&
            isUsersEntity(entry) &&
            Render.distance(entry.position, targetEntity.position, "manhattan") <= 1
        );

        if (!nearbyOwnCharacter) return [];

        return [
          {
            label: "Open chest",
            run: () => openPanel("storage", targetEntity.id, nearbyOwnCharacter.id),
          },
        ];
      }

      case "monster":
      default:
        return [];
    }
  }, [entityId, instance, isOnMasterTurn, isUsersEntity, openPanel, userId]);

  React.useEffect(() => {
    if (!open) return;
    if (actions.length > 0) return;
    close();
  }, [actions.length, close, open]);

  React.useEffect(() => {
    if (!open || actions.length === 0) return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      button: 2,
      buttons: 2,
      clientX: x,
      clientY: y,
    });

    trigger.dispatchEvent(event);
  }, [actions.length, open, x, y]);

  return (
    <Context>
      <Context.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none fixed z-40 h-px w-px opacity-0"
          style={{ left: x, top: y }}
        />
      </Context.Trigger>
      <Context.Content
        className="z-60"
        onEscapeKeyDown={close}
        onPointerDownOutside={close}
        onInteractOutside={close}
      >
        {actions.map((action) => (
          <Context.Item
            key={action.label}
            onClick={() => {
              action.run();
              close();
            }}
          >
            {action.label}
          </Context.Item>
        ))}
      </Context.Content>
    </Context>
  );
};
