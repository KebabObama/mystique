import { betterFetch } from "@better-fetch/fetch";
import { type NextRequest, NextResponse } from "next/server";
import type { auth } from "@/lib/server-auth";

type Session = typeof auth.$Infer.Session;

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/api/auth"))
    return NextResponse.next();
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: { cookie: request.headers.get("cookie") || "" },
    },
  );

  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (session)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }
  if (!session) return NextResponse.redirect(new URL("/auth", request.url));
  return NextResponse.next();
};

export const config = { matcher: ["/dashboard", "/auth"] };
