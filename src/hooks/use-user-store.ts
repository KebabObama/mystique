import { create } from "zustand";
import type { authClient } from "@/lib/auth-client";

type Session = Awaited<ReturnType<typeof authClient.useSession>>["data"];

type UserStore = {
	session: Session;
	user: NonNullable<Session>["user"] | null;
	isAuthenticated: boolean;
	setSession: (session: Session) => void;
	clearSession: () => void;
};

export const useUserStore = create<UserStore>((set, _get) => ({
	session: null,
	user: null,
	isAuthenticated: false,

	setSession: (session) =>
		set({
			session,
			user: session?.user ?? null,
			isAuthenticated: !!session,
		}),

	clearSession: () =>
		set({
			session: null,
			user: null,
			isAuthenticated: false,
		}),
}));
