"use client";

import { SidebarLobbyItem } from "@/components/layout/sidebar-lobby-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLobby } from "@/hooks/use-lobby";
import { LogIn, MessageSquare, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export type LobbyInfo = {
  id: string;
  name: string;
  createdAt: Date;
  memberCount: number;
  characterCount: number;
  isMember: boolean;
  unreadCount?: number;
};

type LobbyCardProps = { lobby: LobbyInfo };

export const LobbyCard = ({ lobby }: LobbyCardProps) => {
  const router = useRouter();
  const fullLobby = useLobby((s) => s.lobbies.find((entry) => entry.id === lobby.id));

  const handleAction = () => {
    if (lobby.isMember) router.push(`/game/${lobby.id}`);
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
        {lobby.isMember && lobby.unreadCount !== undefined && lobby.unreadCount > 0 && (
          <div className="flex items-center gap-1.5">
            <MessageSquare className="text-primary size-4" />
            <span className="text-primary text-sm font-semibold">{lobby.unreadCount} unread</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        {lobby.isMember ? (
          <div className="flex gap-6">
            <Button className="flex-1" size="sm" onClick={handleAction}>
              <LogIn className="size-4" />
              Enter Game
            </Button>
            {fullLobby ? (
              <SidebarLobbyItem lobby={fullLobby}>
                <Button className="flex-1" size="sm" variant="outline">
                  <MessageSquare className="size-4" />
                  Messages
                </Button>
              </SidebarLobbyItem>
            ) : (
              <Button className="flex-1" size="sm" variant="outline" disabled>
                <MessageSquare className="size-4" />
                Messages
              </Button>
            )}
          </div>
        ) : (
          <Button className="w-full" size="sm" variant="outline" onClick={handleAction}>
            <LogIn className="size-4" />
            Join & Enter
          </Button>
        )}
      </div>
    </Card>
  );
};
