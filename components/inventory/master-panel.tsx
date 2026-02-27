import { Dialog } from "@/components/ui/dialog";
import { Game } from "@/lib/game";
import { useGame } from "@/lib/hooks/use-game";
import { getEntityLabel, InventoryItem } from "@/lib/inventory-panel";
import React from "react";
import {
  CharacterInfo,
  ChestInfo,
  GrantControls,
  InventoryList,
  MonsterInfo,
} from "./inventory-panel.components";

type MasterPanelProps = { entity: Game.Entity; items: InventoryItem[]; onClose: () => void };

export const MasterPanel = ({ entity, items, onClose }: MasterPanelProps) => {
  const grant = useGame((state) => state.inventory.grant);
  const dropItem = useGame((state) => state.inventory.dropItem);
  const toggleEquip = useGame((state) => state.inventory.toggleEquip);

  const [grantItemId, setGrantItemId] = React.useState<string | undefined>(items[0]?.id);
  const [grantAmount, setGrantAmount] = React.useState(1);

  const selectedGrantItemId = items.some((i) => i.id === grantItemId) ? grantItemId : items[0]?.id;

  const handleAdd = () => {
    if (!selectedGrantItemId) return;
    grant(entity.id, selectedGrantItemId, grantAmount);
  };

  const handleDelete = (itemId: string, quantity: number) => {
    dropItem(entity.id, itemId, quantity);
  };

  const label = getEntityLabel(entity);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      fullscreen
    >
      <Dialog.Content className="p-0 text-lg select-none">
        <div className="grid h-full grid-cols-3 gap-3">
          <section className="flex h-full flex-col gap-6 border-r-6 p-6">
            <Dialog.Title>{label}</Dialog.Title>
            <Dialog.Description className="-mt-6 mb-0">Manage inventory items</Dialog.Description>

            {entity.type === "character" && <CharacterInfo character={entity.playable} />}
            {entity.type === "chest" && <ChestInfo chest={entity.playable} />}
            {entity.type === "monster" && <MonsterInfo monster={entity.playable} />}

            {entity.type !== "monster" && (
              <GrantControls
                items={items}
                selectedItemId={selectedGrantItemId}
                onChange={setGrantItemId}
                amount={grantAmount}
                onAmountChange={setGrantAmount}
                onAdd={handleAdd}
              />
            )}
          </section>

          <section className="col-span-2 flex flex-col gap-3 overflow-auto p-6">
            <InventoryList
              entity={entity}
              onDrop={handleDelete}
              onEquip={(itemId) => toggleEquip(entity.id, itemId)}
            />
          </section>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
