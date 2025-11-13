import { create } from "zustand";
import type { authClient } from "@/lib/auth-client";

type Session = Awaited<ReturnType<typeof authClient.useSession>>["data"];
type User = NonNullable<Session>["user"];

type UserStore = {
	session: Session;
	setSession: (session: Session) => void;
	clearSession: () => void;
	// Convenience getters
	user: User | null;
	userId: string | null;
	isAuthenticated: boolean;
};

export const useUserStore = create<UserStore>((set, _get) => ({
	session: null,
	user: null,
	userId: null,
	isAuthenticated: false,

	setSession: (session) =>
		set({
			session,
			user: session?.user ?? null,
			userId: session?.user?.id ?? null,
			isAuthenticated: !!session,
		}),

	clearSession: () =>
		set({
			session: null,
			user: null,
			userId: null,
			isAuthenticated: false,
		}),
}));
