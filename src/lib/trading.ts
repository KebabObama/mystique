import { Game } from "@/lib/game";

type TradeItem = { itemId: string; quantity: number };

/** Provides the Trading namespace. */
export namespace Trading {
    /** Represents the item type. */
export type Item = TradeItem;

    /** Represents the offer type. */
export type Offer = {
    items: Array<Item>;
    currency: number;
  };

    /** Represents the session type. */
export type Session = {
    id: string;
    lobbyId: string;
    entityAId: Game.Entity["id"];
    entityBId: Game.Entity["id"];
    offers: Record<string, Offer>;
    confirmed: Record<string, boolean>;
    updatedAt: number;
  };

    /** Defines the empty offer constant. */
export const EMPTY_OFFER: Offer = { items: [], currency: 0 };
}