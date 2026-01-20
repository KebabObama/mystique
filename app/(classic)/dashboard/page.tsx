import { CharacterCreator } from "@/components/game/character-creator";
import { CharacterDashboard } from "@/components/game/character-dashboard";
import { CharacterDelete } from "@/components/game/character-delete";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { character } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Game } from "@/lib/game";
import { eq } from "drizzle-orm";
import { Info, Trash } from "lucide-react";
import { headers } from "next/headers";

const getCharacters = async (userId: string) => {
  const results = await db.query.character.findMany({
    where: eq(character.ownerId, userId),
    with: { inventory: { with: { item: true } } },
  });

  return results.map((char) =>
    Game.completeCharacter({
      ...char,
      inventory: char.inventory.map(({ itemId, characterId: _, ...rest }) => ({
        ...rest,
        ...rest.item,
      })),
    })
  );
};

export default async () => {
  const data = await auth.api.getSession({ headers: await headers() });
  if (!data) return null;
  const characters = await getCharacters(data.user.id);

  return (
    <>
      <CharacterCreator />
      {data && (
        <>
          {characters.length === 0 && (
            <span className="absolute top-1/2 left-1/2 -translate-1/2 text-lg">
              No characters avaliable
            </span>
          )}
          <section className="relative flex grid-cols-3 flex-col gap-6 md:grid lg:grid-cols-4">
            {characters.map((e) => (
              <Card key={e.id}>
                <h1 className="text-lg">{e.name}</h1>
                <div className="flex flex-row justify-between">
                  <p className="text-muted">
                    Race: <span className="text-foreground capitalize">{e.race}</span>
                  </p>
                  <p className="text-muted">
                    Level: <span className="text-foreground">{e.level}</span>
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-6 p-1.5">
                  <CharacterDelete character={e} asChild>
                    <Button className="w-full" size={"sm"} variant={"destructive"}>
                      <Trash />
                    </Button>
                  </CharacterDelete>
                  <CharacterDashboard character={e} asChild>
                    <Button className="w-full" size={"sm"}>
                      <Info />
                    </Button>
                  </CharacterDashboard>
                </div>
              </Card>
            ))}
          </section>
        </>
      )}
    </>
  );
};
