"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Context } from "@/components/ui/context";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import * as React from "react";

type SequenceProps = { children?: React.ReactNode };

export const Sequence = ({ children }: SequenceProps) => {
  const [open, setOpen] = React.useState(false);

  const instance = useGame((s) => s.instance);
  const send = useGame((s) => s.send);
  const userId = useUser((s) => s.id);

  if (!instance) return null;

  const isMaster = instance.masterId === userId;
  const activeId = instance.turn >= 0 ? instance.sequence[instance.turn] : null;

  const Tile = ({ name, plays }: { name: React.ReactNode; plays: boolean }) => (
    <span className={`${plays ? "opacity-100" : "opacity-60"} truncate text-lg`}>{name}</span>
  );

  return (
    <div className="flex max-w-48 min-w-48 flex-col">
      <div
        className={cn(
          "flex flex-col gap-4.5 overflow-hidden transition-all duration-300",
          open ? "max-h-250 pr-1.5 pb-1.5 opacity-100" : "max-h-0 p-0 opacity-0"
        )}
      >
        <Card className="flex h-full flex-col">
          {instance.sequence.map((id, index) => {
            const char = instance.characters.find((c) => c.id === id);
            if (!char) return null;
            const plays = activeId === id;

            const name = (
              <div className="flex flex-row items-center justify-between gap-3">
                <span className="text-lg">{index}</span>
                <span className="truncate">{char.name}</span>
              </div>
            );

            if (!isMaster || instance.turn !== -1) {
              return (
                <div key={char.id}>
                  <Tile name={name} plays={plays} />
                </div>
              );
            }

            return (
              <Context key={char.id}>
                <Context.Trigger>
                  <Tile name={name} plays={plays} />
                </Context.Trigger>
                <Context.Content>
                  <Context.Item
                    onClick={() => send("sequence:move", char.id, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Move up
                  </Context.Item>
                  <Context.Item
                    onClick={() => send("sequence:move", char.id, 1)}
                    disabled={index === instance.sequence.length - 1}
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
              <span className="flex flex-row items-center justify-end gap-3">Dungeon Master</span>
            }
            plays={instance.turn === -1}
          />
        </Card>

        {children}
      </div>

      <Button className={`${open ? "mt-3" : "mt-0"} mr-1.5`} onClick={() => setOpen((v) => !v)}>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        {open ? "Hide order" : "Show order"}
      </Button>
    </div>
  );
};

