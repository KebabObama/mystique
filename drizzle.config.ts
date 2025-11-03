import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./db/build",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DATABASE_HOST as string,
		port: Number(process.env.DATABASE_PORT as string),
		database: process.env.DATABASE_DB as string,
		user: process.env.DATABASE_USER as string,
		password: process.env.DATABASE_PASSWORD as string,
		ssl: false,
	},
});
