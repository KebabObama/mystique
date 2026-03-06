"use client";

import { StoragePanel } from "@/components/inventory/storage-panel";
import { ViewPanel } from "@/components/inventory/view-panel";
import { useGame } from "@/lib/hooks/use-game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import type { InventoryItem } from "@/lib/inventory-panel";
import { MasterPanel } from "./master-panel";

type InventoryPanelProps = { items: InventoryItem[] };

export const InventoryPanel = ({ items }: InventoryPanelProps) => {
  const instance = useGame((state) => state.instance);
  const panelMode = useGame((state) => state.inventory.panelMode);
  const openedEntityId = useGame((state) => state.inventory.openedEntityId);
  const sourceEntityId = useGame((state) => state.inventory.sourceEntityId);
  const closePanel = useGame((state) => state.inventory.closePanel);

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
      const source = sourceEntityId
        ? InGameHelpers.getEntityById(instance, sourceEntityId)
        : undefined;
      if (!source || source.type === "monster" || entity.type === "monster") return null;
      return <StoragePanel sourceEntity={source} targetEntity={entity} onClose={closePanel} />;
    }

    default:
      return null;
  }
};
