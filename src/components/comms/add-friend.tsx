"use client";

import { Copy, UserPlus } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCommunication } from "@/hooks/use-communication";
import { useUser } from "@/hooks/use-user";
import { toast } from "../layout/toast";
import { Border } from "../ui/border";

export const AddFriendSection = () => {
  const { friends } = useCommunication();
  const user = useUser();
  const [input, setInput] = React.useState<string>("");
  const trimmed = input.trim();

  const handleAddFriend = React.useCallback(() => {
    if (
      !trimmed ||
      user.id === trimmed ||
      friends.find((e) => e.friend === trimmed)
    ) {
      toast.error("Something went wrong");
      return;
    }
    friends.request(user, trimmed);
    setInput("");
    toast.success("Friend request sent!");
  }, [friends, user, trimmed]);

  const handleCopyId = React.useCallback(() => {
    if (!user) return;
    navigator.clipboard
      .writeText(user.id)
      .then(() => toast("ID copied to clipboard!"));
  }, [user.id, user]);

  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <UserPlus className="size-5" />
          Add Friend
        </Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-6">
        <div className="flex w-full gap-6">
          <Input
            className="w-full"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFriend();
              }
            }}
            placeholder="Enter friend's user ID"
            value={input}
          />
          <Button
            className="w-auto"
            disabled={!trimmed.length}
            onClick={handleAddFriend}>
            <UserPlus />
            Send
          </Button>
        </div>
        <div className="relative flex items-center gap-2 p-3">
          <Border />
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-xs">Your User ID</p>
            <code className="font-mono text-sm">{user.id}</code>
          </div>
          <Button onClick={handleCopyId} size="sm" variant="outline">
            <Copy className="mr-2 size-4" />
            Copy
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};
