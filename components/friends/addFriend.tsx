"use client";

import type { User } from "better-auth";
import { Search, UserPlus } from "lucide-react";
import React from "react";
import { useFriends } from "@/components/friends/friends-provider";
import Dialog from "@/components/ui/dialog";
import { searchUsers } from "@/lib/friend";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type SearchResult = {
	id: string;
	name: string;
	email: string;
	image: string | null;
	bio: string | null;
};

export default ({ user }: { user: User }) => {
	const [query, setQuery] = React.useState<string>("");
	const [open, setOpen] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [searching, setSearching] = React.useState<boolean>(false);
	const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);

	const { sendRequest } = useFriends();

	React.useEffect(() => {
		if (query.length < 4) {
			setSearchResults([]);
			return;
		}

		const timeoutId = setTimeout(async () => {
			setSearching(true);
			try {
				const results = await searchUsers(query, user.id);
				setSearchResults(results);
			} catch (error) {
				console.error("Search error:", error);
				setSearchResults([]);
			}
			setSearching(false);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [query, user.id]);

	const handleSendRequest = (receiverId: string) => {
		setLoading(true);
		sendRequest(receiverId);
		setQuery("");
		setSearchResults([]);
		setOpen(false);
		setLoading(false);
	};

	const handleReset = () => {
		setQuery("");
		setSearchResults([]);
		setLoading(false);
		setSearching(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				setOpen(newOpen);
				if (!newOpen) {
					handleReset();
				}
			}}
		>
			<Dialog.Trigger asChild>
				<Button>
					<UserPlus className="mr-2 h-4 w-4" />
					Add Friend
				</Button>
			</Dialog.Trigger>
			<Dialog.Content className="max-w-md">
				<Dialog.Header>
					<Dialog.Title>Add New Friend</Dialog.Title>
					<Dialog.Description>
						Search by name, email, or ID to find and add friends
					</Dialog.Description>
				</Dialog.Header>

				<div className="relative">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
					<Input
						type="text"
						placeholder="Search by name, email, or ID.."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				{searching && (
					<div className="text-muted-foreground py-4 text-center">
						Searching...
					</div>
				)}

				{searchResults.length > 0 && (
					<div className="max-h-60 space-y-2 overflow-y-auto">
						{searchResults.map((result) => (
							<div
								key={result.id}
								className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
							>
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarImage
											src={result.image || ""}
											alt={`${result.name}'s profile`}
										/>
										<AvatarFallback>
											{result.name?.charAt(0)?.toUpperCase() || "?"}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium">{result.name}</p>
										<p className="text-muted-foreground truncate text-sm">
											{result.email}
										</p>
										{result.bio && (
											<p className="text-muted-foreground mt-1 truncate text-xs">
												{result.bio}
											</p>
										)}
									</div>
								</div>
								<Button
									size="sm"
									onClick={() => handleSendRequest(result.id)}
									disabled={loading}
								>
									{loading ? "Sending..." : "Add"}
								</Button>
							</div>
						))}
					</div>
				)}

				{query.length >= 4 && !searching && searchResults.length === 0 && (
					<div className="text-muted-foreground py-4 text-center">
						No users found matching "{query}"
					</div>
				)}

				{query.length < 4 && (
					<div className="text-muted-foreground py-4 text-center">
						Type at least 4 characters to search
					</div>
				)}
			</Dialog.Content>
		</Dialog>
	);
};
