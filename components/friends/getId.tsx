"use client";

import type { User } from "better-auth";
import { toast } from "../layout/toast";
import { Button } from "../ui/button";

export default ({ user }: { user: User }) => {
	return (
		<Button
			onClick={async () => {
				await navigator.clipboard.writeText(user.id);
				toast("User id was copied to clipboard");
			}}
		>
			Copy ID
		</Button>
	);
};
