"use client";

import React from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "@/components/layout/toast";
import type { Friend, Message, SendMessage, User } from "@/types/communication";
import { useUser } from "./use-user";

export type CommunicationContextValue = {
  socket: Socket | null;
  groups: null[];
  messages: { send: (msg: SendMessage) => void } & Message[];
  friends: {
    request: (sender: User, receiver: string) => void;
    accept: (id: string) => void;
    deny: (id: string) => void;
  } & Friend[];
};

const CommunicationContext = React.createContext<
  CommunicationContextValue | undefined
>(undefined);

export const CommunicationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = io();
  const user = useUser();
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    fetch("/api/communication");
  }, []);

  React.useEffect(() => {
    if (!user.id || typeof window === "undefined") return;

    socket.on("connect", () => {
      socket.emit("join-room", user.id);
    });

    socket.on("message:all", (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on("message:new", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender !== user.id)
        toast({ message: msg.text, title: "New message" });
    });

    socket.on("friend:all", (allFriends: Friend[]) => {
      setFriends(allFriends);
    });

    socket.on("friend:new", (newFriend: Friend) => {
      setFriends((prev) => [...prev, newFriend]);
      toast({
        message: `New friend request from: ${newFriend.name}`,
        title: "Friend request",
      });
    });

    socket.on("friend:accept", (id: string) => {
      setFriends((prev) =>
        prev.map((f) => (f.id === id ? { ...f, accepted: true } : f)),
      );
    });

    socket.on("friend:deny", (id: string) => {
      setFriends((prev) => prev.filter((f) => f.id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, [user.id, socket.disconnect, socket.emit, socket.on]);

  const value: CommunicationContextValue = {
    socket: socket,
    groups: [],
    messages: Object.assign(messages, {
      send: (message: SendMessage) => {
        socket.emit("message:new", message);
      },
    }),
    friends: Object.assign(friends, {
      request: (sender: User, receiver: string) => {
        socket.emit("friend:new", sender, receiver);
      },
      accept: (id: string) => {
        socket.emit("friend:accept", id);
      },
      deny: (id: string) => {
        socket.emit("friend:deny", id);
      },
    }),
  };

  React.useEffect(() => {
    console.log(friends);
  }, [friends]);

  return (
    <CommunicationContext.Provider value={value}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const ctx = React.useContext(CommunicationContext);
  if (!ctx)
    throw new Error(
      "useCommunication must be used within <CommunicationProvider>",
    );
  return ctx;
};
