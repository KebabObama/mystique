import { Dialog } from "@/components/ui/dialog";
import { useGame } from "@/hooks/use-game";
import { Game } from "@/lib/game";
import { getEntityLabel } from "@/lib/inventory-panel";
import { InventoryList } from "./inventory-panel.components";

type StoragePanelProps = {
  sourceEntity: Game.Entity;
  targetEntity: Game.Entity;
  onClose: () => void;
};

/** Renders the storage panel component. */
export const StoragePanel = ({ sourceEntity, targetEntity, onClose }: StoragePanelProps) => {
  const transfer = useGame((state) => state.inventory.transfer);
  const dropItem = useGame((state) => state.inventory.dropItem);

  const sourceLabel = getEntityLabel(sourceEntity);
  const targetLabel = getEntityLabel(targetEntity);

  const handleTransferToTarget = (itemId: string, quantity: number) => {
    transfer(sourceEntity.id, targetEntity.id, itemId, quantity);
  };

  const handleTransferToSource = (itemId: string, quantity: number) => {
    transfer(targetEntity.id, sourceEntity.id, itemId, quantity);
  };

  const moveToTargetLabel =
    targetEntity.type === "chest" ? `Store in ${targetLabel}` : `Give to ${targetLabel}`;
  const moveToSourceLabel = targetEntity.type === "chest" ? "Take" : `Take from ${targetLabel}`;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      fullscreen
    >
      <Dialog.Content className="p-0 text-lg select-none">
        <div className="grid h-full grid-cols-2 gap-0">
          <section className="flex flex-col gap-3 overflow-auto border-r-6 p-6">
            <Dialog.Title>{sourceLabel}</Dialog.Title>
            <Dialog.Description className="-mt-3 mb-0">Your inventory</Dialog.Description>
            <InventoryList
              entity={sourceEntity}
              onTransfer={handleTransferToTarget}
              onDrop={(itemId, qty) => dropItem(sourceEntity.id, itemId, qty)}
              transferLabel={moveToTargetLabel}
            />
          </section>

          <section className="flex flex-col gap-3 overflow-auto p-6">
            <h2 className="-mt-3 text-lg font-bold tracking-tight">{targetLabel}</h2>
            <p className="text-muted mb-0 font-semibold">
              {targetEntity.type === "chest" ? "Chest contents" : "Inventory"}
            </p>
            <InventoryList
              entity={targetEntity}
              onTransfer={handleTransferToSource}
              onDrop={(itemId, qty) => dropItem(targetEntity.id, itemId, qty)}
              transferLabel={moveToSourceLabel}
            />
          </section>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
