"use client";

import { Card } from "@/components/ui/card";
import { Context } from "@/components/ui/context";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { ArrowDown, ArrowUp, DraftingCompassIcon } from "lucide-react";
import React from "react";

type SequenceProps = { children?: React.ReactNode };

export const Sequence = ({ children }: SequenceProps) => {
  const instance = useGame((s) => s.instance);
  const send = useGame((s) => s.send);
  const userId = useUser((s) => s.id);

  if (!instance) return null;

  const isMaster = instance.masterId === userId;

  return (
    <div className="flex flex-col gap-6" onContextMenu={(e) => e.preventDefault()}>
      {instance.sequence.map((id) => {
        const char = instance.characters.find((c) => c.id === id);
        if (!char) return null;

        const index = instance.sequence.indexOf(id);
        const plays = instance.turn !== -1 && instance.sequence[instance.turn] === id;

        const card = (
          <Card
            className={`flex flex-col justify-between gap-0 px-4 py-1 ${plays ? "opacity-100" : "opacity-60"}`}
          >
            {char.name}
          </Card>
        );

        if (!isMaster || instance.turn !== -1)
          return <React.Fragment key={char.id}>{card}</React.Fragment>;

        return (
          <Context key={char.id}>
            <Context.Trigger>{card}</Context.Trigger>
            <Context.Content>
              <Context.Item
                onClick={() => send("sequence:move", char.id, -1)}
                disabled={index === 0}
              >
                <ArrowUp /> Move up
              </Context.Item>
              <Context.Item
                onClick={() => send("sequence:move", char.id, +1)}
                disabled={index === instance.sequence.length - 1}
              >
                <ArrowDown /> Move down
              </Context.Item>
            </Context.Content>
          </Context>
        );
      })}

      <Card
        className={`justify-between flex flex-row gap-3 text-lg px-4 py-1 ${instance.turn === -1 ? "opacity-100" : "opacity-60"}`}
      >
        <DraftingCompassIcon className="size-6" />
        Dungeon Master
      </Card>

      {children}
    </div>
  );
};

