"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Game } from "@/lib/game";
import { useDialog } from "@/lib/hooks/use-dialog";
import { useGame } from "@/lib/hooks/use-game";
import { useUser } from "@/lib/hooks/use-user";
import React from "react";

type DraftState = { items: Record<string, number>; currency: number };

const toDraft = (offer?: {
  items: Array<{ itemId: string; quantity: number }>;
  currency: number;
}): DraftState => ({
  items: Object.fromEntries((offer?.items ?? []).map((item) => [item.itemId, item.quantity])),
  currency: offer?.currency ?? 0,
});

const fromDraft = (draft: DraftState) => ({
  items: Object.entries(draft.items)
    .map(([itemId, quantity]) => ({ itemId, quantity: Math.max(0, Math.floor(quantity)) }))
    .filter((item) => item.quantity > 0),
  currency: Math.max(0, Math.floor(draft.currency)),
});

export const TradingDialog = () => {
  const userId = useUser((s) => s?.id);
  const instance = useGame((s) => s.instance);
  const open = useDialog((s) => s.trading.dialogOpen);
  const closeDialog = useDialog((s) => s.trading.closeDialog);
  const selectedCharacterId = useDialog((s) => s.trading.selectedCharacterId);
  const activeSession = useDialog((s) => s.trading.activeSession);
  const updateOffer = useGame((s) => s.trading.updateOffer);
  const setConfirmed = useGame((s) => s.trading.setConfirmed);
  const cancelTrade = useGame((s) => s.trading.cancelTrade);

  const [draftA, setDraftA] = React.useState<DraftState>({ items: {}, currency: 0 });
  const [draftB, setDraftB] = React.useState<DraftState>({ items: {}, currency: 0 });

  const selectedCharacter =
    instance && selectedCharacterId
      ? Game.getEntities(instance).find(
          (entity): entity is Extract<typeof entity, { type: "character" }> =>
            entity.id === selectedCharacterId && entity.type === "character"
        )
      : undefined;

  const session =
    instance &&
    activeSession &&
    (activeSession.entityAId === selectedCharacterId ||
      activeSession.entityBId === selectedCharacterId)
      ? activeSession
      : null;

  const firstCharacter =
    session && instance
      ? Game.getEntities(instance).find(
          (entity): entity is Extract<typeof entity, { type: "character" }> =>
            entity.id === session.entityAId && entity.type === "character"
        )
      : selectedCharacter;

  const secondCharacter =
    session && instance
      ? Game.getEntities(instance).find(
          (entity): entity is Extract<typeof entity, { type: "character" }> =>
            entity.id === session.entityBId && entity.type === "character"
        )
      : undefined;

  React.useEffect(() => {
    if (!session) return;
    setDraftA(toDraft(session.offers[session.entityAId]));
    setDraftB(toDraft(session.offers[session.entityBId]));
  }, [session?.id, session?.updatedAt, session?.entityAId, session?.entityBId, session?.offers]);

  if (!open || !instance || !selectedCharacterId || !selectedCharacter) return null;

  const controlsFirst =
    !!userId &&
    !!session &&
    !!firstCharacter &&
    (firstCharacter.ownerId === userId || instance.masterId === userId);
  const controlsSecond =
    !!userId &&
    !!session &&
    !!secondCharacter &&
    (secondCharacter.ownerId === userId || instance.masterId === userId);

  const applyOffer = (entityId: string, draft: DraftState) => {
    if (!session) return;
    updateOffer(session.id, entityId, fromDraft(draft));
  };

  const updateItemDraft = (
    which: "a" | "b",
    entityId: string,
    itemId: string,
    maxQty: number,
    value: number
  ) => {
    const nextValue = Math.max(0, Math.min(maxQty, Number(value) || 0));
    if (which === "a") {
      const next = { ...draftA, items: { ...draftA.items, [itemId]: nextValue } };
      setDraftA(next);
      applyOffer(entityId, next);
      return;
    }

    const next = { ...draftB, items: { ...draftB.items, [itemId]: nextValue } };
    setDraftB(next);
    applyOffer(entityId, next);
  };

  const updateCurrencyDraft = (
    which: "a" | "b",
    entityId: string,
    maxQty: number,
    value: number
  ) => {
    const nextValue = Math.max(0, Math.min(maxQty, Number(value) || 0));
    if (which === "a") {
      const next = { ...draftA, currency: nextValue };
      setDraftA(next);
      applyOffer(entityId, next);
      return;
    }

    const next = { ...draftB, currency: nextValue };
    setDraftB(next);
    applyOffer(entityId, next);
  };

  const renderInventoryColumn = (
    character: Extract<typeof selectedCharacter, { type: "character" }>,
    side: "a" | "b",
    canEdit: boolean
  ) => {
    const draft = side === "a" ? draftA : draftB;
    const coinMax = character.inventory.find((entry) => entry.name === "Gold Coin")?.quantity ?? 0;

    return (
      <div className="space-y-2 rounded-lg border p-2">
        <p className="text-sm font-semibold">{character.name} inventory</p>
        <div className="max-h-72 space-y-2 overflow-y-auto">
          {character.inventory.length === 0 ? (
            <p className="text-muted-foreground text-sm">Empty</p>
          ) : (
            character.inventory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-2 text-sm">
                <span>
                  {entry.name} (x{entry.quantity})
                </span>
                <input
                  type="number"
                  min={0}
                  max={entry.quantity}
                  disabled={!canEdit}
                  value={draft.items[entry.id] ?? 0}
                  onChange={(e) =>
                    updateItemDraft(
                      side,
                      character.id,
                      entry.id,
                      entry.quantity,
                      Number(e.target.value)
                    )
                  }
                  className="w-16 rounded border px-2 py-1 text-right disabled:opacity-50"
                />
              </div>
            ))
          )}
        </div>
        <label className="text-sm">
          Coins:
          <input
            type="number"
            min={0}
            max={coinMax}
            disabled={!canEdit}
            value={draft.currency}
            onChange={(e) =>
              updateCurrencyDraft(side, character.id, coinMax, Number(e.target.value))
            }
            className="ml-2 w-16 rounded border px-2 py-1 text-right disabled:opacity-50"
          />
        </label>
      </div>
    );
  };

  const renderBarterColumn = (
    character: Extract<typeof selectedCharacter, { type: "character" }>,
    side: "a" | "b"
  ) => {
    const offer = session?.offers[character.id] ?? { items: [], currency: 0 };

    return (
      <div className="space-y-2 rounded-lg border p-2">
        <p className="text-sm font-semibold">{character.name} barter</p>
        <div className="max-h-72 space-y-1 overflow-y-auto text-sm">
          {offer.items.length === 0 ? (
            <p className="text-muted-foreground">No items offered</p>
          ) : (
            offer.items.map((item) => {
              const itemName = character.inventory.find((entry) => entry.id === item.itemId)?.name;
              return (
                <p key={item.itemId}>
                  {itemName ?? item.itemId} × {item.quantity}
                </p>
              );
            })
          )}
        </div>
        <p className="text-sm">Coins offered: {offer.currency}</p>
        <p className="text-xs text-slate-500">
          {session?.confirmed[character.id] ? "Accepted ✓" : "Waiting acceptance"}
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()} fullscreen={true}>
      <Dialog.Content className="max-w-6xl">
        <Dialog.Title>Trading</Dialog.Title>

        {!session || !firstCharacter || !secondCharacter ? (
          <p className="text-sm">Loading trade...</p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3">
              {renderInventoryColumn(firstCharacter, "a", controlsFirst)}
              {renderBarterColumn(firstCharacter, "a")}
              {renderBarterColumn(secondCharacter, "b")}
              {renderInventoryColumn(secondCharacter, "b", controlsSecond)}

              <div className="col-span-4 grid grid-cols-4 gap-3 pt-2">
                <div className="text-muted-foreground col-span-4 text-sm">
                  Status: {firstCharacter.name}{" "}
                  {session.confirmed[firstCharacter.id] ? "accepted" : "pending"}
                  {" · "}
                  {secondCharacter.name}{" "}
                  {session.confirmed[secondCharacter.id] ? "accepted" : "pending"}
                </div>

                {controlsFirst && (
                  <Button
                    className="col-span-2"
                    variant={session.confirmed[firstCharacter.id] ? "default" : "outline"}
                    onClick={() =>
                      setConfirmed(
                        session.id,
                        firstCharacter.id,
                        !session.confirmed[firstCharacter.id]
                      )
                    }
                  >
                    {session.confirmed[firstCharacter.id]
                      ? `${firstCharacter.name} accepted ✓`
                      : `Accept as ${firstCharacter.name}`}
                  </Button>
                )}

                {controlsSecond && (
                  <Button
                    className="col-span-2"
                    variant={session.confirmed[secondCharacter.id] ? "default" : "outline"}
                    onClick={() =>
                      setConfirmed(
                        session.id,
                        secondCharacter.id,
                        !session.confirmed[secondCharacter.id]
                      )
                    }
                  >
                    {session.confirmed[secondCharacter.id]
                      ? `${secondCharacter.name} accepted ✓`
                      : `Accept as ${secondCharacter.name}`}
                  </Button>
                )}
              </div>
            </div>

            <Button
              onClick={() => cancelTrade(session.id)}
              variant="outline"
              className="mt-auto w-full"
            >
              Cancel Trade
            </Button>
          </>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
