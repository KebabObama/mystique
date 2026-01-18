import { index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// prettier-ignore
export const lobby = pgTable("lobby", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         text("name").notNull(),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

// prettier-ignore
export const lobbyMember = pgTable("lobby_member", {
  lobbyId:    uuid("lobby_id").notNull().references(() => lobby.id, { onDelete: "cascade" }),
  userId:     uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  }, (table) => [
    primaryKey({ columns: [table.lobbyId, table.userId] }), 
    index("member_user_idx").on(table.userId)
]);

// prettier-ignore
export const message = pgTable("message", {
    id:         uuid("id").primaryKey().defaultRandom(),
    lobbyId:    uuid("lobby_id").notNull().references(() => lobby.id, { onDelete: "cascade" }),
    senderId:   uuid("sender_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    content:    text("content").notNull(),
    createdAt:  timestamp("created_at").defaultNow().notNull(),
  }, (table) => [
    index("message_lobby_idx").on(table.lobbyId)
]);

