"use client";

import type { User } from "better-auth";
import { Check, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import Popover from "../ui/popover";
import { useFriends } from "./friends-provider";

export default ({ user, forMe }: { user: User; forMe: boolean }) => {
	const { loading, requestsForMe, requestsFromMe, acceptRequest, denyRequest } =
		useFriends();
	if (loading)
		return <div className="text-muted-foreground text-center">Loading...</div>;
	const requests = forMe ? requestsForMe : requestsFromMe;
	if (requests.length === 0)
		return (
			<div className="text-muted-foreground text-center">
				{forMe ? "No pending requests" : "No sent requests"}
			</div>
		);
	return (
		<div className="flex w-full flex-col gap-6">
			{requests.map((f) => (
				<Popover key={f.id}>
					<Popover.Trigger asChild>
						<Button variant="default" size={"lg"}>
							<span className="ml-2 truncate text-lg font-medium">
								{f.name}
							</span>
						</Button>
					</Popover.Trigger>
					<Popover.Content
						align="center"
						sideOffset={16}
						side="bottom"
						className="flex w-full flex-row gap-6"
					>
						{forMe && (
							<Button
								className="w-full"
								onClick={async () => {
									acceptRequest(f.id);
								}}
							>
								<Check />
							</Button>
						)}
						<Button
							variant={"destructive"}
							className="w-full"
							onClick={async () => {
								if (forMe) await denyRequest(f.id);
								else await denyRequest(user.id);
							}}
						>
							{forMe ? <X /> : <Trash />}
						</Button>
					</Popover.Content>
				</Popover>
			))}
		</div>
	);
};
