"use client";

import { MasterPanel, StoragePanel, ViewPanel } from "@/components/inventory";
import { useGame } from "@/hooks/use-game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import type { InventoryItem } from "@/lib/inventory-panel";

type InventoryPanelProps = { items: InventoryItem[] };

/** Renders the inventory panel component. */
export const InventoryPanel = ({ items }: InventoryPanelProps) => {
  const instance = useGame((state) => state.instance);
  const { panelMode, openedEntityId, sourceEntityId, closePanel } = useGame((s) => s.inventory);

  if (!instance || !panelMode || !openedEntityId) return null;

  const entity = InGameHelpers.getEntityById(instance, openedEntityId);
  if (!entity) return null;

  switch (panelMode) {
    case "master":
      return <MasterPanel entity={entity} items={items} onClose={closePanel} />;

    case "view":
      if (entity.type !== "character") return null;
      return <ViewPanel character={entity} onClose={closePanel} />;

    case "inspect":
      if (entity.type !== "character") return null;
      return <ViewPanel character={entity} onClose={closePanel} readonly />;

    case "storage": {
      const source = instance.characters.find((e) => e.id === sourceEntityId);
      if (!source) return null;
      return <StoragePanel sourceEntity={source} targetEntity={entity} onClose={closePanel} />;
    }

    default:
      return null;
  }
};
