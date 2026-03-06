import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Context } from "@/components/ui/context";
import { Input } from "@/components/ui/input";
import { ItemCard } from "@/components/ui/item-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Game } from "@/lib/game";
import { InventoryItem } from "@/lib/inventory-panel";
import {
  ArrowRightLeft,
  BookA,
  Coins,
  Heart,
  PackageOpen,
  Section,
  Shield,
  ShieldCheck,
  ShieldOff,
  Weight,
} from "lucide-react";
import React from "react";

/* ------------------------------------------------------------------ */
/*  InventoryList – ItemCards with all actions inside context menu     */
/* ------------------------------------------------------------------ */

type InventoryListProps = {
  entity: Game.Entity;
  onTransfer?: (itemId: string, quantity: number) => void;
  onDrop?: (itemId: string, quantity: number) => void;
  onEquip?: (itemId: string) => void;
  transferLabel?: string;
};

export const InventoryList = ({
  entity,
  onTransfer,
  onDrop,
  onEquip,
  transferLabel = "Transfer",
}: InventoryListProps) => {
  if (entity.type === "monster") return null;

  const entries =
    entity.type === "character" || entity.type === "chest" ? (entity.inventory ?? []) : [];
  const hasActions = Boolean(onTransfer || onDrop || onEquip);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-1.5">
      {entries.length === 0 && <div className="text-muted text-center text-sm">Empty</div>}
      {entries.map((entry) => {
        const canEquip =
          onEquip &&
          entity.type === "character" &&
          entry.type !== "misc" &&
          (("equipped" in entry && entry.equipped) ||
            Game.canEquipItem(entity, entry.type));
        if (!hasActions) return <ItemCard key={entry.id} item={entry} />;
        return (
          <InventoryItemWithActions
            key={entry.id}
            entry={entry}
            onTransfer={onTransfer}
            onDrop={onDrop}
            onEquip={canEquip ? onEquip : undefined}
            transferLabel={transferLabel}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Single item – context menu with slider + labelled actions         */
/* ------------------------------------------------------------------ */

type InventoryItemActionsProps = {
  entry: Game.Character["inventory"][number] | Game.Chest["inventory"][number];
  onTransfer?: (itemId: string, quantity: number) => void;
  onDrop?: (itemId: string, quantity: number) => void;
  onEquip?: (itemId: string) => void;
  transferLabel: string;
};

const InventoryItemWithActions = ({
  entry,
  onTransfer,
  onDrop,
  onEquip,
  transferLabel,
}: InventoryItemActionsProps) => {
  const [amount, setAmount] = React.useState(1);
  const isEquipped = "equipped" in entry && entry.equipped;
  const maxAmount = entry.quantity;
  const safeAmount = Math.min(Math.max(1, amount), maxAmount);

  return (
    <Context>
      <Context.Trigger>
        <ItemCard item={entry} />
      </Context.Trigger>
      <Context.Content>
        {maxAmount > 1 && (
          <div className="px-2 py-1.5">
            <div className="text-muted-foreground mb-1 text-xs font-medium">
              Quantity: {safeAmount}
            </div>
            <Slider
              value={[safeAmount]}
              min={1}
              max={maxAmount}
              step={1}
              onValueChange={(v) => setAmount(v[0] ?? 1)}
            />
          </div>
        )}

        {onEquip && (
          <Context.Item onClick={() => onEquip(entry.id)}>
            {isEquipped ? (
              <>
                <ShieldOff className="mr-2 h-4 w-4" />
                Unequip
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Equip
              </>
            )}
          </Context.Item>
        )}

        {onTransfer && (
          <Context.Item onClick={() => onTransfer(entry.id, safeAmount)}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {transferLabel} {safeAmount > 1 ? safeAmount : ""}
          </Context.Item>
        )}

        {onDrop && maxAmount > 0 && (
          <Context.Item onClick={() => onDrop(entry.id, safeAmount)}>
            <PackageOpen className="mr-2 h-4 w-4" />
            Drop {safeAmount > 1 ? safeAmount : ""}
          </Context.Item>
        )}
      </Context.Content>
    </Context>
  );
};

/* ------------------------------------------------------------------ */
/*  GrantControls – master item-add bar                                */
/* ------------------------------------------------------------------ */

type GrantControlsProps = {
  items: InventoryItem[];
  selectedItemId?: string;
  onChange: (value: string) => void;
  amount: number;
  onAmountChange: (value: number) => void;
  onAdd: () => void;
};

export const GrantControls = ({
  items,
  selectedItemId,
  onChange,
  amount,
  onAmountChange,
  onAdd,
}: GrantControlsProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4.5 border-t pt-3">
      <Select value={selectedItemId} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Item to add" />
        </SelectTrigger>
        <SelectContent side="bottom" align="start" sideOffset={4} collisionPadding={8}>
          <div className="flex flex-col p-1.5">
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="mt-1.5 flex max-h-40 flex-col overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="text-muted-foreground py-2 text-center text-sm">No items found</div>
              ) : (
                filteredItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))
              )}
            </div>
          </div>
        </SelectContent>
      </Select>

      <div className="space-y-1">
        <div className="text-muted-foreground text-xs">Amount: {amount}</div>
        <Slider
          value={[amount]}
          min={1}
          max={20}
          step={1}
          onValueChange={(value) => onAmountChange(value[0] ?? 1)}
        />
      </div>

      <Button size="sm" onClick={onAdd}>
        Add {amount}
      </Button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Entity info cards – character-dashboard-style stat displays        */
/* ------------------------------------------------------------------ */

const StatRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <span className="flex w-full flex-row justify-between">
    {label}:
    <span className="text-foreground flex items-center gap-2">
      {value} {icon}
    </span>
  </span>
);

export const CharacterInfo = ({ character }: { character: Game.Character }) => (
  <Card className="bg-background text-muted mt-auto">
    <span className="text-foreground mb-1 flex w-full justify-between capitalize">
      <span>{character.race}</span>
      <span>Level {character.level}</span>
    </span>
    <StatRow
      label="Health"
      value={`${character.hp} / ${character.maxHp}`}
      icon={<Heart className="text-muted size-4" />}
    />
    <StatRow
      label="Weight"
      value={`${character.weight} / ${character.maxWeight}`}
      icon={<Weight className="text-muted size-4" />}
    />
    <StatRow
      label="Actions"
      value={character.maxActions}
      icon={<Section className="text-muted size-4" />}
    />
    <StatRow
      label="Memories"
      value={`${character.memory} / ${character.maxMemory}`}
      icon={<BookA className="text-muted size-4" />}
    />
    <StatRow
      label="Armor"
      value={character.armor}
      icon={<Shield className="text-muted size-4" />}
    />
    <StatRow label="Coins" value={character.coins} icon={<Coins className="text-muted size-4" />} />
  </Card>
);

export const ChestInfo = ({ chest }: { chest: Game.Chest }) => (
  <Card className="bg-background text-muted">
    <StatRow label="Name" value={chest.name} />
    <StatRow label="Items" value={chest.inventory?.length} />
  </Card>
);

export const MonsterInfo = ({ monster }: { monster: Game.Monster }) => (
  <Card className="bg-background text-muted">
    <StatRow
      label="Health"
      value={`${monster.hp} / ${monster.maxHp}`}
      icon={<Heart className="text-muted size-4" />}
    />
    <StatRow label="Armor" value={monster.armor} icon={<Shield className="text-muted size-4" />} />
    <StatRow label="Level" value={monster.level} />
  </Card>
);
