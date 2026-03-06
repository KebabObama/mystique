import { Dialog } from "@/components/ui/dialog";
import { useGame } from "@/lib/hooks/use-game";
import { Game } from "@/types";
import { CharacterInfo, InventoryList } from "./inventory-panel.components";

type ViewPanelProps = {
  character: Extract<Game.Entity, { type: "character" }>;
  onClose: () => void;
  readonly?: boolean;
};

export const ViewPanel = ({ character, onClose, readonly }: ViewPanelProps) => {
  const toggleEquip = useGame((state) => state.inventory.toggleEquip);
  const dropItem = useGame((state) => state.inventory.dropItem);

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
            <Dialog.Title>{character.name}</Dialog.Title>
            <Dialog.Description className="-mt-6 mb-0">
              {readonly ? "Viewing character" : "Your character"}
            </Dialog.Description>
            <CharacterInfo character={character} />
          </section>
          <section className="col-span-2 flex flex-col gap-3 overflow-auto p-6">
            <InventoryList
              entity={character}
              {...(!readonly && {
                onEquip: (itemId: string) => toggleEquip(character.id, itemId),
                onDrop: (itemId: string, qty: number) => dropItem(character.id, itemId, qty),
              })}
            />
          </section>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
