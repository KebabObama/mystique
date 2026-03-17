import { auth } from "@/lib/auth";
import { toNodeHandler } from "better-auth/node";
/** Defines the runtime configuration. */
export const config = { api: { bodyParser: false } };
/** Provides the default export for [...all]. */
export default toNodeHandler(auth.handler);
