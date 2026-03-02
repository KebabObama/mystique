"use client";

import { Context } from "@/components/ui/context";
import { Game } from "@/lib/game";
import { useGame } from "@/lib/hooks/use-game";
import { useUser } from "@/lib/hooks/use-user";
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

    const targetEntity = Game.getEntityById(instance, entityId);
    if (!targetEntity) return [];

    if (isOnMasterTurn) {
      return [{ label: "Open inventory", run: () => openPanel("master", targetEntity.id) }];
    }

    switch (targetEntity.type) {
      case "character": {
        const activeEntity = Game.getEntityById(
          instance,
          instance.data.sequence[instance.data.turn]
        );
        const activeCharacter = activeEntity?.type === "character" ? activeEntity : null;
        const controlsActiveCharacter =
          !!activeCharacter &&
          (activeCharacter.playable.ownerId === userId || instance.masterId === userId);
        const canTradeWithTarget =
          !!activeCharacter &&
          controlsActiveCharacter &&
          activeCharacter.id !== targetEntity.id &&
          Render.distance(activeCharacter.position, targetEntity.position, "manhattan") <= 1;

        const isOwnAndActive = isUsersEntity(targetEntity);
        const actions: MenuAction[] = [
          {
            label: isOwnAndActive ? "Open inventory" : "Inspect",
            run: () => openPanel(isOwnAndActive ? "view" : "inspect", targetEntity.id),
          },
        ];

        if (canTradeWithTarget && activeCharacter) {
          actions.push({
            label: "Trade",
            run: () => useGame.getState().trading.openDialog(activeCharacter.id, targetEntity.id),
          });
        }

        return actions;
      }

      case "chest": {
        const nearbyOwnCharacter = instance.characters.find(
          (entry) =>
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

      case "campfire": {
        const nearbyOwnCharacter = instance.characters.find(
          (entry) =>
            isUsersEntity(entry) &&
            Render.distance(entry.position, targetEntity.position, "manhattan") <= 1
        );

        if (!nearbyOwnCharacter) return [];

        return [
          {
            label: "Rest & Heal",
            run: () => useGame.getState().campfire.openRest(targetEntity.id, nearbyOwnCharacter.id),
          },
          {
            label: "Shop",
            run: () => useGame.getState().campfire.openShop(targetEntity.id, nearbyOwnCharacter.id),
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
