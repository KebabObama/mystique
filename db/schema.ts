import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: uuid("id").unique().defaultRandom().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull(),
});

export const account = pgTable("account", {
	id: uuid("id").unique().defaultRandom().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => new Date())
		.notNull(),
});

export const verification = pgTable("verification", {
	id: uuid("id").unique().defaultRandom().notNull(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull(),
});

export const friendship = pgTable("friendship", {
	id: uuid("id").unique().defaultRandom().notNull(),
	sender: uuid("sender")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	receiver: uuid("receiver")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	state: integer("state").notNull().default(0),
});

export const message = pgTable("message", {
	id: uuid("id").unique().defaultRandom().notNull(),
	text: text("text").notNull(),
	sender: uuid("sender")
		.notNull()
		.references(() => user.id),
	receivers: uuid("receivers").array().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
