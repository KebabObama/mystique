import * as schema from "@/db/schema";

export type User = typeof schema.user.$inferSelect;
export type Message = typeof schema.message.$inferSelect;
export type SendMessage = Omit<Message, "id" | "createdAt">;
export type Friend = {
  id: string;
  friend: string;
  name: string;
  image: string | null;
  accepted: boolean;
  sender: string;
};
