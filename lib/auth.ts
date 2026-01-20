import { db } from "@/lib/db";
import { schema } from "@/lib/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sendResetPassword, sendVerificationEmail } from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  advanced: { database: { generateId: false, useNumberId: false } },
  secret: process.env.BETTER_AUTH_SECRET as string,
  baseURL: process.env.BETTER_AUTH_URL as string,
  emailAndPassword: { enabled: true, requireEmailVerification: false, sendResetPassword },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: false,
    sendOnSignIn: false,
    sendVerificationEmail: sendVerificationEmail,
  },
  experimental: { joins: true },
  account: { encryptOAuthTokens: true },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  plugins: [nextCookies()],
  user: { changeEmail: { enabled: true, updateEmailWithoutVerification: true } },
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
