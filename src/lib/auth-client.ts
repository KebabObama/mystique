import { createAuthClient } from "better-auth/react";
import type { user } from "@/db/schema";

export type User = typeof user.$inferSelect;

export const authClient = createAuthClient();
