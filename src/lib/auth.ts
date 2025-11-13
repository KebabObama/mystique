import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { db } from "@/lib/db";
import { cache } from "./cache";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema: schema }),
	advanced: { database: { generateId: false, useNumberId: false } },
	secondaryStorage: {
		get: async (key) => {
			return await cache.get(key);
		},
		set: async (key, value) => {
			await cache.set(key, value);
		},
		delete: async (key) => {
			await cache.del(key);
		},
	},
	secret: process.env.BETTER_AUTH_SECRET as string,
	baseURL: process.env.BETTER_AUTH_URL as string,
	emailAndPassword: { enabled: true },
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		cookieCache: { enabled: true, maxAge: 60 * 5 },
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
});
