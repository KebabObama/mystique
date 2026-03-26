"use client";

import { Context } from "@/components/ui/context";
import { useDialog } from "@/hooks/use-dialog";
import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { Render } from "@/lib/render";
import React from "react";

type MenuAction = { label: string; run: () => void };

/** Renders the entity context menu component. */
export const EntityContextMenu = () => {
  const instance = useGame((s) => s.instance);
  const activeEntity = useGame((s) => s.sequence.current);
  const openPanel = useGame((s) => s.inventory.openPanel);
  const { isUsersEntity, isMasterOnTurn, canControlEntity } = usePermissions();
  const { x, y, close, entityId, open } = useDialog((s) => s.entityContextMenu);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const actions = React.useMemo<MenuAction[]>(() => {
    if (!instance || !entityId) return [];

    const targetEntity = InGameHelpers.getEntityById(instance, entityId);
    if (!targetEntity) return [];

    if (isMasterOnTurn)
      return [{ label: "Open inventory", run: () => openPanel("master", targetEntity.id) }];

    switch (targetEntity.type) {
      case "character": {
        const activeCharacter = activeEntity?.type === "character" ? activeEntity : null;
        const controlsActiveCharacter = !!activeCharacter && canControlEntity(activeCharacter);
        const canOpenInventory = canControlEntity(targetEntity);
        const canTradeWithTarget =
          !!activeCharacter &&
          controlsActiveCharacter &&
          activeCharacter.id !== targetEntity.id &&
          Render.distance(activeCharacter.position, targetEntity.position, "manhattan") <= 1;

        const actions: MenuAction[] = [
          {
            label: canOpenInventory ? "Open inventory" : "View",
            run: () => openPanel(canOpenInventory ? "view" : "inspect", targetEntity.id),
          },
        ];

        if (canTradeWithTarget && activeCharacter) {
          actions.push({
            label: "Trade",
            run: () => {
              useDialog.getState().trading.openDialog(activeCharacter.id);
              useGame.getState().trading.startTrade(targetEntity.id, [], 0);
            },
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
            run: () =>
              useDialog.getState().campfire.openRest(targetEntity.id, nearbyOwnCharacter.id),
          },
          {
            label: "Shop",
            run: () =>
              useDialog.getState().campfire.openShop(targetEntity.id, nearbyOwnCharacter.id),
          },
        ];
      }

      case "monster":
      default:
        return [];
    }
  }, [
    activeEntity,
    canControlEntity,
    entityId,
    instance,
    isMasterOnTurn,
    isUsersEntity,
    openPanel,
  ]);

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
