"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useCommunication } from "@/hooks/use-communication";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import type { Friend, SendMessage, User } from "@/types/communication";
import { Send, UserMinus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Border } from "../ui/border";
import { Input } from "../ui/input";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { FriendSlot } from "./friend-slot";

const FriendDialog = ({ friend, user }: { friend: Friend; user: User }) => {
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
    <div className="flex flex-col gap-6">
      <div className="overflow-show bg-muted/20 relative rounded-lg border">
        <Border />
        <div className="flex h-full max-h-[48dvh] min-h-[48dvh] w-full flex-col items-center gap-2 overflow-y-auto p-4 md:max-h-120 md:resize-y">
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
                    ? "bg-background text-primary-foreground"
                    : "bg-background border"
                )}
              >
                {m.text}
              </div>
              <div className="text-muted-foreground flex scale-0 flex-col gap-0 text-xs font-light opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <span>{m.sender === user.id ? user.name : friend.name}</span>
                <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
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

      <div className="border-border dark:border-ring -mx-6 flex flex-col gap-3 border-t-3 px-6 pt-8 pb-4 md:pb-0">
        {showConfirmRemove ? (
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground w-full text-sm">Remove friend</span>
            <Button className="" onClick={handleRemoveFriend} size="sm" variant="destructive">
              Confirm
            </Button>
            <Button onClick={() => setShowConfirmRemove(false)} size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setShowConfirmRemove(true)} variant="destructive">
            <UserMinus className="mr-2 size-4" />
            Remove Friend
          </Button>
        )}
      </div>
    </div>
  );
};

export const FriendsListSection = () => {
  const { friends } = useCommunication();
  const user = useUser();

  const arr = React.useMemo(() => friends.filter((e) => e.accepted), [friends]);

  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Friends</Card.Title>
      </Card.Header>
      <Card.Content className="flex w-full flex-col items-center justify-center gap-9">
        {!friends.length && <p className="text-muted-foreground text-sm">No requests yet</p>}
        {arr.map((f) => (
          <ResponsiveDialog
            asChild
            className="md:min-w-lg lg:min-w-3xl xl:min-w-6xl"
            key={f.id}
            title={
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={f.image || undefined} />
                </Avatar>
                <span className="text-lg">{f.name}</span>
              </div>
            }
            trigger={
              <FriendSlot
                className="transition-all duration-300 active:translate-y-2"
                image={f.image}
                name={f.name}
              />
            }
          >
            <FriendDialog friend={f} user={user} />
          </ResponsiveDialog>
        ))}
      </Card.Content>
    </Card>
  );
};
