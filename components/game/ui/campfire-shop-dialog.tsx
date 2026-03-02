"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useGame } from "@/lib/hooks/use-game";

export const CampfireShopDialog = () => {
  const instance = useGame((s) => s.instance);
  const open = useGame((s) => s.campfire.shopDialogOpen);
  const closeShop = useGame((s) => s.campfire.closeShop);
  const selectedCampfireId = useGame((s) => s.campfire.selectedCampfireId);
  const selectedCharacterId = useGame((s) => s.campfire.selectedCharacterId);

  if (!open || !selectedCampfireId || !selectedCharacterId || !instance) return null;

  const campfireEntity = instance.entities.find((e) => e.id === selectedCampfireId);
  const charEntity = instance.entities.find((e) => e.id === selectedCharacterId);

  if (
    !campfireEntity ||
    campfireEntity.type !== "campfire" ||
    !charEntity ||
    charEntity.type !== "character"
  )
    return null;

  // Get currency from inventory
  const currencyItem = charEntity.playable.inventory.find((inv) => inv.item.name === "Gold Coin");
  const currencyAmount = currencyItem?.quantity ?? 0;

  const handleBuy = (itemId: string, cost: number) => {
    if (currencyAmount < cost) {
      // Could show error toast here
      return;
    }
    useGame.getState().send("campfire:shop:buy", selectedCharacterId, itemId, 1);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeShop()}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Title>Campfire Shop</Dialog.Title>
        <p className="text-sm text-slate-600">Gold Coins: {currencyAmount}</p>
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {campfireEntity.playable.shopItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No items available</p>
          ) : (
            campfireEntity.playable.shopItems.map((shopItem) => (
              <div
                key={shopItem.item.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
              >
                <div>
                  <p className="font-medium">{shopItem.item.name}</p>
                  <p className="text-sm text-slate-600">Cost: {shopItem.cost} coins</p>
                </div>
                <Button
                  onClick={() => handleBuy(shopItem.item.id, shopItem.cost)}
                  disabled={currencyAmount < shopItem.cost}
                  size="sm"
                >
                  Buy
                </Button>
              </div>
            ))
          )}
        </div>
        <Button onClick={closeShop} variant="outline" className="w-full">
          Close
        </Button>
      </Dialog.Content>
    </Dialog>
  );
};

