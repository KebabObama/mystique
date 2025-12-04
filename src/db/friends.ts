import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import * as schema from "./schema";

export const friend = pgTable(
  "friend",
  {
    id: uuid("id").unique().notNull().defaultRandom(),
    sender: uuid("sender")
      .references(() => schema.user.id, { onDelete: "cascade" })
      .notNull(),
    receiver: uuid("receiver")
      .references(() => schema.user.id, { onDelete: "cascade" })
      .notNull(),
    accepted: boolean("accepted").notNull(),
  },
  (table) => ({
    pair: unique("friendship_unique").on(table.sender, table.receiver),
  }),
);

export const messageType = pgEnum("message_type", ["friend"]);

export const message = pgTable("message", {
  id: uuid("id").defaultRandom().unique().notNull(),
  type: messageType("message_type").notNull(),
  link: uuid("link").notNull(),
  sender: uuid("sender")
    .notNull()
    .references(() => schema.user.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
