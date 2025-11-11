import type { User } from "better-auth";
import { headers } from "next/headers";
import FriendsClient from "@/components/friends/friends-client";
import { auth } from "@/lib/auth";

export default async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) return null;
	return <FriendsClient user={session?.user as User} />;
};
