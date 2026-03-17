import { LobbyCard, type LobbyInfo } from "@/components/dashboard";

type LobbyListProps = { lobbies: LobbyInfo[] };

export const LobbyList = ({ lobbies }: LobbyListProps) => {
  if (lobbies.length === 0) return null;

  return (
    <section className="flex-cols flex w-full gap-6">
      {lobbies.map((lobby) => (
        <LobbyCard key={lobby.id} lobby={lobby} />
      ))}
    </section>
  );
};
