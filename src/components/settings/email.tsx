"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/hooks/use-user-store";
import { authClient } from "@/lib/auth-client";
import { toast } from "../layout/toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ResponsiveDialog from "../ui/responsive-dialog";

export default () => {
	const user = useUserStore((state) => state.user);
	const [email, setEmail] = useState(user?.email || "");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const accept = async () => {
		if (!email.trim()) return;
		setLoading(true);
		const { error } = await authClient.changeEmail({ newEmail: email });
		setLoading(false);
		if (error) {
			toast.error("Could not change email");
			return;
		}
		toast.success("Email successfully changed");
		setOpen(false);
	};

	useEffect(() => {
		open;
		setEmail(user?.email || "");
	}, [user?.email, open]);

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={(v) => !loading && setOpen(v)}
			trigger={<Button>Change Email</Button>}
			title="Change email"
		>
			<div className="flex flex-col gap-6">
				<Input
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={loading}
					placeholder="Enter your new email"
					autoFocus
				/>
				<Button onClick={accept} disabled={loading || !email.trim()}>
					{loading ? "Updating..." : "Accept"}
				</Button>
			</div>
		</ResponsiveDialog>
	);
};
