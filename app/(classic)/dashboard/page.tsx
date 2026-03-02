import { CharacterCreator } from "@/components/character/character-creator";
import { CharacterList } from "@/components/dashboard/character-list";
import { LobbyList } from "@/components/dashboard/lobby-list";
import { LobbyCreate } from "@/components/layout/lobby-create";
import { auth } from "@/lib/auth";
import { getCharacters, getLobbies } from "@/lib/dashboard";
import { headers } from "next/headers";

export default async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [characters, lobbies] = await Promise.all([
    getCharacters(session.user.id),
    getLobbies(session.user.id),
  ]);

  const myLobbies = lobbies.filter((l) => l.isMember);
  const availableLobbies = lobbies.filter((l) => !l.isMember);

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
        <div className="grid flex-1 grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_1.5px_1fr] lg:gap-0 lg:overflow-hidden">
          <section className="overflow-y-auto px-4">
            <h2 className="mb-4 text-center text-xl font-semibold">
              My Lobbies ({myLobbies.length})
            </h2>
            <LobbyList lobbies={myLobbies} />
          </section>
          <div className="bg-border mx-4 hidden h-full w-1.5 lg:block" />
          <section className="overflow-y-auto lg:pl-4">
            <h2 className="mb-4 text-center text-xl font-semibold">
              Available Lobbies ({availableLobbies.length})
            </h2>
            <LobbyList lobbies={availableLobbies} />
          </section>
        </div>
      </div>
    </div>
  );
};
