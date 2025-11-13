import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export const friendRequest = pgTable("friend_request", {
	id: uuid("id").unique().notNull().defaultRandom(),
	sender: uuid("sender")
		.references(() => schema.user.id, {
			onDelete: "cascade",
		})
		.notNull(),
	receiver: uuid("receiver")
		.references(() => schema.user.id, {
			onDelete: "cascade",
		})
		.notNull(),
});

export const friend = pgTable("friend", {
	id: uuid("id").unique().notNull().defaultRandom(),
	a: uuid("user_a")
		.notNull()
		.references(() => schema.user.id, { onDelete: "cascade" }),
	b: uuid("user_b")
		.notNull()
		.references(() => schema.user.id, { onDelete: "cascade" }),
});

export const group = pgTable("group", {
	id: uuid("id").unique().notNull().defaultRandom(),
	users: uuid("users").array().notNull(),
	name: text("name").notNull(),
});

export const message = pgTable("direct_message", {
	id: uuid("id").defaultRandom().unique().notNull(),
	isGroup: boolean("is_group").notNull().default(false),
	link: uuid("link").notNull(), // FriendId or GroupId
	sender: uuid("sender")
		.notNull()
		.references(() => schema.user.id, { onDelete: "cascade" }),
	text: text("text").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});
