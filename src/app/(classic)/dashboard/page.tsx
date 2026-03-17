"use client";

import { CharacterCreator } from "@/components/character/character-creator";
import { CharacterList } from "@/components/dashboard/character-list";
import { LobbyList } from "@/components/dashboard/lobby-list";
import { LobbyCreate } from "@/components/layout/lobby-create";
import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@/hooks/use-user";
import { getCharacters } from "@/lib/dashboard";
import type { LobbyInfo } from "@/lib/types";
import { getUnreadCount } from "@/lib/utils";
import { useEffect, useState } from "react";

export default () => {
  const userId = useUser((s) => s?.id);
  const lobbies = useLobby((s) => s.lobbies);
  const [characters, setCharacters] = useState<Awaited<ReturnType<typeof getCharacters>>>([]);

  useEffect(() => {
    if (!userId) return;
    getCharacters(userId).then(setCharacters);
  }, [userId]);

  const myLobbies: LobbyInfo[] = lobbies.map((lobby) => ({
    id: lobby.id,
    name: lobby.name,
    createdAt: lobby.createdAt,
    memberCount: lobby.members.length,
    characterCount: 0,
    isMember: true,
    unreadCount: userId ? getUnreadCount(lobby, userId) : 0,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted text-sm">Manage characters and join lobbies</p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row">
          <CharacterCreator />
          <LobbyCreate sidebar={false} />
        </div>
      </div>

      <div className="h-screen-minus-header flex flex-col">
        <section className="pb-8">
          <h2 className="mb-4 text-center text-xl font-semibold">
            My Characters ({characters.length})
          </h2>
          <CharacterList characters={characters} />
        </section>

        <div className="bg-border relative left-1/2 h-1.5 w-screen -translate-x-1/2" />
        <section className="flex-1 overflow-y-auto px-4">
          <h2 className="mb-4 text-center text-xl font-semibold">
            My Lobbies ({myLobbies.length})
          </h2>
          <LobbyList lobbies={myLobbies} />
        </section>
      </div>
    </div>
  );
};
