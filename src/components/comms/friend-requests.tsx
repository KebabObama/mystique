"use client";

import { Check, UserPlus, X } from "lucide-react";
import { useCallback } from "react";
import { useCommunication } from "@/components/providers/comms-provider";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Popover from "../ui/popover";

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

	if (requests.length === 0) return null;

	return (
		<Card>
			<Card.Header>
				<Card.Title className="flex items-center">
					<UserPlus className="size-5" />
					Friend Requests
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div className="flex flex-col gap-6">
					{requests.map((req) => (
						<Popover key={req.sender}>
							<Popover.Trigger>
								<Card>
									<Card.Content className="grid grid-cols-2 gap-6">
										<Avatar className="size-12">
											<AvatarImage src={req.senderImage || undefined} />
											<AvatarFallback>
												{(req.senderName || "?").charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col text-right">
											<span className="font-medium">
												{req.senderName || "Unknown User"}
											</span>
											<span className="text-sm text-muted-foreground">
												{req.senderEmail || ""}
											</span>
										</div>
									</Card.Content>
								</Card>
							</Popover.Trigger>
							<Popover.Content className="grid grid-cols-2 gap-6">
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
				</div>
			</Card.Content>
		</Card>
	);
};
