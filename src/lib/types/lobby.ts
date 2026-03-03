export type Lobby = {
  id: string;
  name: string;
  createdAt: Date;
  members: Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    lastReadAt: Date | null;
  }>;
  messages: Array<{
    id: string;
    createdAt: Date;
    lobbyId: string;
    senderId: string;
    content: string;
  }>;
};
