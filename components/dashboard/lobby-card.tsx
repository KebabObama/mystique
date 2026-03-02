"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLobby } from "@/lib/hooks/use-lobby";
import { useUser } from "@/lib/hooks/use-user";
import { LogIn, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export type LobbyInfo = {
  id: string;
  name: string;
  createdAt: Date;
  memberCount: number;
  characterCount: number;
  isMember: boolean;
};

type LobbyCardProps = { lobby: LobbyInfo };

export const LobbyCard = ({ lobby }: LobbyCardProps) => {
  const router = useRouter();
  const userId = useUser((s) => s?.id);
  const joinLobby = useLobby((s) => s?.joinLobby);

  const handleAction = () => {
    if (lobby.isMember) {
      router.push(`/game/${lobby.id}`);
    } else if (userId) {
      joinLobby(lobby.id);
      // Wait a moment for the join to process, then navigate
      setTimeout(() => router.push(`/game/${lobby.id}`), 500);
    }
  };

  return (
    <Card className="w-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{lobby.name}</h2>
          <p className="text-muted text-xs">
            Created {new Date(lobby.createdAt).toLocaleDateString()}
          </p>
        </div>
        {lobby.isMember && (
          <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">Joined</span>
        )}
      </div>

      <div className="mt-3 flex gap-4">
        <div className="flex items-center gap-1.5">
          <Users className="text-muted size-4" />
          <span className="text-sm">
            {lobby.memberCount} {lobby.memberCount === 1 ? "member" : "members"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">
            {lobby.characterCount} {lobby.characterCount === 1 ? "character" : "characters"}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Button
          className="w-full"
          size="sm"
          variant={lobby.isMember ? "default" : "outline"}
          onClick={handleAction}
        >
          <LogIn className="size-4" />
          {lobby.isMember ? "Enter Lobby" : "Join & Enter"}
        </Button>
      </div>
    </Card>
  );
};

