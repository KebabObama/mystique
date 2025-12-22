"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useCommunication } from "@/hooks/use-communication";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import type { Friend, SendMessage } from "@/types/communication";
import { User } from "better-auth";
import { Send, UserMinus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";
import { Input } from "../ui/input";
import { FriendSlot } from "./friend-slot";

const FriendDialogContent = ({ friend, user }: { friend: Friend; user: User }) => {
  const [msg, setMsg] = React.useState("");
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);
  const { messages, friends } = useCommunication();

  const filteredMessages = React.useMemo(
    () => messages.filter((m) => m.type === "friend" && m.link === friend.id),
    [messages, friend]
  );

  const handleSendMessage = React.useCallback(() => {
    if (!(msg.trim() && user?.id)) return;
    messages.send({ type: "friend", link: friend.id, text: msg, sender: user.id } as SendMessage);
    setMsg("");
  }, [messages, user, msg, friend.id]);

  const handleRemoveFriend = React.useCallback(() => {
    friends.deny(friend.id);
    setShowConfirmRemove(false);
    toast.success(`Removed ${friend.name} from friends`);
  }, [friend, friends]);

  return (
    <>
      <div className="bg-muted/20 relative flex-1 overflow-hidden rounded-lg border">
        <Border />
        <div className="flex h-full min-h-[40vh] w-full flex-col items-center gap-2 overflow-y-auto p-4">
          {filteredMessages.map((m) => (
            <div
              className={cn(
                "group flex w-full justify-between gap-2",
                m.sender === user?.id ? "flex-row-reverse" : "flex-row"
              )}
              key={m.id}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-lg px-4 py-1 text-sm wrap-break-word",
                  m.sender === user.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border"
                )}
              >
                {m.text}
              </div>
              <div className="text-muted flex scale-0 flex-col gap-0 text-xs font-light opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <span>{m.sender === user.id ? user.name : friend.name}</span>
                <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-4">
        <Input
          className="w-full"
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          value={msg}
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="size-4" />
        </Button>
      </div>

      <Dialog.Footer className="border-t pt-4">
        {showConfirmRemove ? (
          <div className="flex w-full items-center justify-between gap-4">
            <span className="text-muted text-sm">Are you sure?</span>
            <div className="flex gap-2">
              <Button onClick={handleRemoveFriend} size="sm" variant="destructive">
                Confirm
              </Button>
              <Button onClick={() => setShowConfirmRemove(false)} size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full sm:w-auto"
            onClick={() => setShowConfirmRemove(true)}
            variant="destructive"
          >
            <UserMinus className="mr-2 size-4" />
            Remove Friend
          </Button>
        )}
      </Dialog.Footer>
    </>
  );
};

export const FriendsListSection = () => {
  const { friends } = useCommunication();
  const user = useUser();

  const acceptedFriends = React.useMemo(() => friends.filter((e) => e.accepted), [friends]);

  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Friends</Card.Title>
      </Card.Header>
      <Card.Content className="flex w-full flex-col items-center justify-center gap-4">
        {!acceptedFriends.length && <p className="text-muted py-8 text-sm">No friends yet</p>}

        {acceptedFriends.map((f) => (
          <Dialog.Root key={f.id} fullscreen>
            <Dialog.Trigger asChild>
              <FriendSlot
                className="w-full cursor-pointer transition-all duration-300 active:translate-y-1"
                image={f.image}
                name={f.name}
              />
            </Dialog.Trigger>

            <Dialog.Content className="md:max-w-3xl">
              <Dialog.Title>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={f.image || undefined} />
                  </Avatar>
                  <span>{f.name}</span>
                </div>
              </Dialog.Title>
              <Dialog.Description>Chat with your friend</Dialog.Description>

              <FriendDialogContent friend={f} user={user} />
            </Dialog.Content>
          </Dialog.Root>
        ))}
      </Card.Content>
    </Card>
  );
};
