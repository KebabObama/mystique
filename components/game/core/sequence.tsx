"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Context } from "@/components/ui/context";
import { Game } from "@/lib/game";
import { useGame } from "@/lib/hooks/use-game";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import * as React from "react";

type SequenceProps = { children?: React.ReactNode };

export const Sequence = ({ children }: SequenceProps) => {
  const [open, setOpen] = React.useState(true);

  const instance = useGame((s) => s.instance);
  const send = useGame((s) => s.send);
  const current = useGame((s) => s.sequence.current);
  const isOnMasterTurn = useGame((s) => s.sequence.isOnMasterTurn);

  if (!instance) return null;

  const Tile = ({ name, plays }: { name: React.ReactNode; plays: boolean }) => (
    <span className={`${plays ? "opacity-100" : "opacity-60"} truncate text-sm`}>{name}</span>
  );

  return (
    <div className="flex max-w-40 min-w-40 flex-col">
      <div
        className={cn(
          "flex flex-col gap-1.5 overflow-hidden transition-all duration-300",
          open ? "max-h-250 pr-1.5 pb-1.5 opacity-100" : "max-h-0 p-0 opacity-0"
        )}
      >
        <Card className="flex h-full flex-col p-2">
          {instance.data.sequence.map((entityId, index) => {
            const wrapper = Game.getEntityById(instance, entityId);
            if (!wrapper) return null;
            const plays = current?.id === entityId;

            const displayName = wrapper.playable.name || "";

            const name = (
              <div className="flex flex-row items-center justify-between gap-2">
                <span className="text-sm">{index}</span>
                <span className="truncate">{displayName}</span>
              </div>
            );

            return !isOnMasterTurn ? (
              <div key={wrapper.id}>
                <Tile name={name} plays={plays} />
              </div>
            ) : (
              <Context key={wrapper.id}>
                <Context.Trigger>
                  <Tile name={name} plays={plays} />
                </Context.Trigger>
                <Context.Content>
                  <Context.Item
                    onClick={() => send("sequence:move", wrapper.id, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Move up
                  </Context.Item>
                  <Context.Item
                    onClick={() => send("sequence:move", wrapper.id, 1)}
                    disabled={index === instance.data.sequence.length - 1}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Move down
                  </Context.Item>
                </Context.Content>
              </Context>
            );
          })}
          <Tile
            name={
              <span className="flex flex-row items-center justify-end gap-1.5">Dungeon Master</span>
            }
            plays={instance.data.turn === -1}
          />
        </Card>

        {children}
      </div>

      <Button size="sm" className={`mr-1.5 text-sm`} onClick={() => setOpen((v) => !v)}>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        {open ? "Hide order" : "Show order"}
      </Button>
    </div>
  );
};
