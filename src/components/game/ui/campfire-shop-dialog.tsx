"use client";

import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDialog } from "@/lib/hooks/use-dialog";
import { useGame } from "@/lib/hooks/use-game";
import { InGameHelpers } from "@/lib/ingame-helpers";

export const CampfireShopDialog = () => {
  const instance = useGame((s) => s.instance);
  const open = useDialog((s) => s.campfire.shopDialogOpen);
  const closeShop = useDialog((s) => s.campfire.closeShop);
  const selectedCampfireId = useDialog((s) => s.campfire.selectedCampfireId);
  const selectedCharacterId = useDialog((s) => s.campfire.selectedCharacterId);

  if (!open || !selectedCampfireId || !selectedCharacterId || !instance) return null;

  const campfireEntity = InGameHelpers.getEntities(instance).find(
    (e) => e.id === selectedCampfireId
  );
  const charEntity = InGameHelpers.getEntities(instance).find((e) => e.id === selectedCharacterId);

  if (
    !campfireEntity ||
    campfireEntity.type !== "campfire" ||
    !charEntity ||
    charEntity.type !== "character"
  )
    return null;

  const shopItems = ((campfireEntity as any).shopItems ?? []) as Array<any>;

  // Get currency from inventory
  const currencyItem = charEntity.inventory.find((inv) => inv.name === "Gold Coin");
  const currencyAmount = currencyItem?.quantity ?? 0;

  const handleBuy = (itemId: string, cost: number) => {
    if (currencyAmount < cost) {
      toast.error("Not enough gold coins");
      return;
    }
    useGame.getState().send("campfire:shop:buy", selectedCharacterId, itemId, 1);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeShop()}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Title>Campfire Shop</Dialog.Title>
        <p className="text-sm">Gold Coins: {currencyAmount}</p>
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {shopItems.length === 0 ? (
            <p className="py-8 text-center text-sm">No items available</p>
          ) : (
            shopItems.map((shopItem) => (
              <div
                key={shopItem.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{shopItem.name}</p>
                  <p className="text-sm">Cost: {shopItem.cost} coins</p>
                </div>
                <Button
                  onClick={() => handleBuy(shopItem.id, shopItem.cost)}
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
