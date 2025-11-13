"use client";

import { Check, UserPlus, X } from "lucide-react";
import { useCallback } from "react";
import { useCommunication } from "@/components/providers/comms-provider";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import Popover from "../ui/popover";
import { FriendSlot } from "./friend-slot";

export const FriendRequestsSection = () => {
	const { requests, acceptRequest, denyRequest } = useCommunication();

	const handleAccept = useCallback(
		(senderId: string) => acceptRequest(senderId),
		[acceptRequest],
	);

	const handleDeny = useCallback(
		(senderId: string) => denyRequest(senderId),
		[denyRequest],
	);

	return (
		<Card className={requests.length ? "w-full" : "w-full hidden lg:block"}>
			<Card.Header>
				<Card.Title className="flex items-center">
					<UserPlus className="size-5" />
					Friend Requests
				</Card.Title>
			</Card.Header>
			<Card.Content className="flex flex-col gap-6 items-center justify-center">
				{requests.length === 0 && (
					<p className="text-sm text-muted-foreground">No requests pending</p>
				)}
				{requests.map((req) => (
					<Popover key={req.sender}>
						<Popover.Trigger className="w-full">
							<FriendSlot
								image={req.senderImage}
								name={req.senderName}
								email={req.senderEmail}
							/>
						</Popover.Trigger>
						<Popover.Content className="grid grid-cols-2 gap-6" sideOffset={15}>
							<Button
								size="sm"
								onClick={() => handleAccept(req.sender as string)}
							>
								<Check className="size-4 mr-1" />
								Accept
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleDeny(req.sender as string)}
							>
								<X className="size-4 mr-1" />
								Deny
							</Button>
						</Popover.Content>
					</Popover>
				))}
			</Card.Content>
		</Card>
	);
};
