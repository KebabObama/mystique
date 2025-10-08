import { user } from "@/db/schema";
import { createAuthClient } from "better-auth/react";

export type User = typeof user.$inferSelect;

export const authClient = createAuthClient();
