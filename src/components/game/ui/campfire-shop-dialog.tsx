"use client";

import { Card } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDialog } from "@/hooks/use-dialog";
import { useGame } from "@/hooks/use-game";

/** Renders the campfire shop dialog component. */
export const CampfireShopDialog = () => {
  const instance = useGame((s) => s.instance);
  const open = useDialog((s) => s.campfire.shopDialogOpen);
  const closeShop = useDialog((s) => s.campfire.closeShop);
  const selectedCampfireId = useDialog((s) => s.campfire.selectedCampfireId);
  const selectedCharacterId = useDialog((s) => s.campfire.selectedCharacterId);

  if (!open || !selectedCampfireId || !selectedCharacterId || !instance) return null;

  const camp = instance.campfires.find((e) => e.id === selectedCampfireId);
  const char = instance.characters.find((e) => e.id === selectedCharacterId);

  if (!camp || !char) return null;

  const handleBuy = (itemId: string, cost: number) => {
    if (char.coins < cost) return;
    useGame.getState().send("campfire:shop:buy", selectedCharacterId, itemId, 1);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeShop()}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Title>Campfire Shop</Dialog.Title>
        <p className="text-sm">Coins: {char.coins}</p>
        <div className="flex max-h-96 flex-col gap-6 overflow-y-auto px-1.5 py-3">
          {camp.shopItems.length === 0 ? (
            <p className="py-8 text-center text-sm">No items available</p>
          ) : (
            camp.shopItems.map((shopItem) => (
              <Card key={shopItem.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{shopItem.name}</p>
                  <p className="text-sm">Cost: {shopItem.cost} coins</p>
                </div>
                <Button
                  onClick={() => handleBuy(shopItem.id, shopItem.cost)}
                  disabled={char.coins < shopItem.cost}
                  size="sm"
                  className="my-auto"
                >
                  Buy
                </Button>
              </Card>
            ))
          )}
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
