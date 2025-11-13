"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUserStore } from "@/stores/user-store";
import { toast } from "../layout/toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ResponsiveDialog from "../ui/responsive-dialog";

export default () => {
	const user = useUserStore((state) => state.user);
	const [name, setName] = useState(user?.name || "");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const accept = async () => {
		if (!name.trim()) return;
		setLoading(true);
		const { error } = await authClient.updateUser({ name });
		setLoading(false);
		if (error) {
			toast.error("Could not change username");
			return;
		}
		toast.success("Username successfully changed");
		setOpen(false);
	};

	useEffect(() => {
		open;
		setName(user?.name || "");
	}, [user?.name, open]);

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={(v) => !loading && setOpen(v)}
			trigger={<Button>Change Name</Button>}
			title="Change username"
		>
			<div className="flex flex-col gap-6">
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={loading}
					placeholder="Enter your new name"
					autoFocus
				/>
				<Button onClick={accept} disabled={loading || !name.trim()}>
					{loading ? "Updating..." : "Accept"}
				</Button>
			</div>
		</ResponsiveDialog>
	);
};
