"use client";

import { AddFriendSection } from "@/components/comms/add-friend";
import { FriendsListSection } from "@/components/comms/friend-list";
import { FriendRequestsSection } from "@/components/comms/friend-requests";

export default () => {
  return (
    <>
      <AddFriendSection />
      <div className="flex gap-6">
        <FriendsListSection />
        <FriendRequestsSection />
      </div>
    </>
  );
};
