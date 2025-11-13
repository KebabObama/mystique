"use client";

import { useEffect } from "react";
import { useUserStore } from "@/hooks/use-user-store";
import { authClient } from "@/lib/auth-client";

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
