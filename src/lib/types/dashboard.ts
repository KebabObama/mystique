import type { Character } from "./game";

export type CharacterLobby = {
  id: string;
  name: string;
  memberCount: number;
  members: string[];
};

export type CharacterWithLobby = Character & { lobby: CharacterLobby | null };

export type LobbyInfo = {
  id: string;
  name: string;
  createdAt: Date;
  memberCount: number;
  characterCount: number;
  isMember: boolean;
  unreadCount?: number;
};