"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useUserStore } from "@/stores/user-store";

export const UserStoreProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { data } = authClient.useSession();
	const setSession = useUserStore((state) => state.setSession);

	useEffect(() => {
		setSession(data);
	}, [data, setSession]);

	return <>{children}</>;
};
