"use client";

import { AddFriendSection } from "@/components/comms/add-friend";
import { FriendsListSection } from "@/components/comms/friend-list";
import { FriendRequestsSection } from "@/components/comms/friend-requests";
import { useUserStore } from "@/hooks/use-user-store";
import { Users } from "lucide-react";

export default function FriendsPage() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated)
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
        <Users className="mb-4 size-16 opacity-50" />
        <p className="text-lg">You must be signed in to use Friends.</p>
      </div>
    );

  return (
    <>
      <AddFriendSection />
      <div className="flex gap-6">
        <FriendsListSection />
        <FriendRequestsSection />
      </div>
    </>
  );
}
