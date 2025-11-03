import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export const middleware = async (request: NextRequest) => {
	if (request.nextUrl.pathname.startsWith("/api/auth"))
		return NextResponse.next();
	const session = await auth.api.getSession({ headers: await headers() });
	if (request.nextUrl.pathname.startsWith("/auth")) {
		if (session)
			return NextResponse.redirect(new URL("/dashboard", request.url));
		return NextResponse.next();
	}
	if (!session) return NextResponse.redirect(new URL("/auth", request.url));
	return NextResponse.next();
};

export const config = {
	runtime: "nodejs",
	matcher: ["/dashboard", "/auth", "/settings", "/friends"],
};
