"use client";
import type { User } from "better-auth";
import { Button } from "../ui/button";
import AddFriend from "./addFriend";
import Friends from "./friends";
import { useFriends } from "./friends-provider";
import GetId from "./getId";
import Requests from "./requests";

export default ({ user }: { user: User }) => {
	const { refresh } = useFriends();

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			<GetId user={user} />
			<AddFriend user={user} />
			<Button onClick={refresh}>Refresh</Button>
			<section>
				<h1 className="mb-2 text-center text-xl font-semibold">Friends</h1>
				<Friends user={user} />
			</section>
			<section>
				<h1 className="mb-2 text-center text-xl font-semibold">My requests</h1>
				<Requests user={user} forMe={true} />
			</section>
			<section>
				<h1 className="mb-2 text-center text-xl font-semibold">
					Pending requests
				</h1>
				<Requests user={user} forMe={false} />
			</section>
		</div>
	);
};
