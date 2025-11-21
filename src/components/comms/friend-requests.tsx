"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useCommunication } from "@/hooks/use-communication";
import { useUser } from "@/hooks/use-user";
import { Check, Trash, UserPlus, X } from "lucide-react";
import React from "react";
import Popover from "../ui/popover";
import { FriendSlot } from "./friend-slot";

export const FriendRequestsSection = () => {
  const { friends } = useCommunication();
  const user = useUser();
  const requests = React.useMemo(() => {
    return friends.filter((e) => !e.accepted);
  }, [friends]);

  return (
    <Card className={requests.length ? "w-full" : "hidden w-full lg:block"}>
      <Card.Header>
        <Card.Title className="flex items-center">
          <UserPlus className="size-5" />
          Friend Requests
        </Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col items-center justify-center gap-6">
        {requests.length === 0 && <p className="text-muted-foreground text-sm">No requests pending</p>}
        {requests.map((req) => (
          <Popover key={req.sender}>
            <Popover.Trigger asChild className="w-full">
              <FriendSlot image={req.image} name={req.name} />
            </Popover.Trigger>
            <Popover.Content className="grid grid-cols-2 gap-6" sideOffset={12}>
              {req.sender === user.id ? (
                <Button size="sm" variant="destructive" onClick={() => friends.deny(req.id)} className="col-span-2">
                  <Trash className="mr-1 size-4" />
                  Cancel
                </Button>
              ) : (
                <>
                  <Button size="sm" onClick={() => friends.accept(req.id)}>
                    <Check className="mr-1 size-4" />
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => friends.deny(req.id)}>
                    <X className="mr-1 size-4" />
                    Deny
                  </Button>
                </>
              )}
            </Popover.Content>
          </Popover>
        ))}
      </Card.Content>
    </Card>
  );
};
