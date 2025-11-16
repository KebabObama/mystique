"use client";

import { toast } from "@/components/layout/toast";
import { Friend, Message, SendMessage, User } from "@/types/communication";
import React from "react";
import { io, Socket } from "socket.io-client";
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

// --- Context ---
const CommunicationContext = React.createContext<
  CommunicationContextValue | undefined
>(undefined);

// --- Provider ---
export const CommunicationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socketRef = React.useRef<Socket | null>(null);
  const user = useUser();
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (!user?.id) return;
    if (typeof window === "undefined") return;

    const socket = io(process.env.NEXT_PUBLIC_COMMS_SOCKET_URL as string, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Socket connected");
      socket.emit("join-room", user.id);
    });

    socket.on("message:all", (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on("message:new", (msg: Message) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
      if (msg.sender !== user.id) toast(msg.text);
    });

    socket.on("friend:all", (allFriends: Friend[]) => {
      setFriends(allFriends);
    });

    socket.on("friend:new", (newFriend: Friend) => {
      setFriends((prev) => [...prev, newFriend]);
      toast(`New friend request from: ${newFriend.name}`);
    });

    socket.on("friend:accept", (id: string) => {
      setFriends((prev) =>
        prev.map((f) => (f.id === id ? { ...f, accepted: true } : f))
      );
    });

    socket.on("friend:deny", (id: string) => {
      setFriends((prev) => prev.filter((f) => f.id !== id));
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  const value: CommunicationContextValue = {
    socket: socketRef.current,
    groups: [],
    messages: Object.assign(messages, {
      send: (message: SendMessage) => {
        socketRef.current?.emit("message:new", message);
        console.log("message:new", message);
      },
    }),
    friends: Object.assign(friends, {
      request: (sender: User, receiver: string) => {
        socketRef.current?.emit("friend:new", sender, receiver);
        console.log("friend:new", sender, receiver);
      },
      accept: (id: string) => {
        socketRef.current?.emit("friend:accept", id);
        console.log("friend:accept", id);
      },
      deny: (id: string) => {
        socketRef.current?.emit("friend:deny", id);
        console.log("friend:deny", id);
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
      "useCommunication must be used within <CommunicationProvider>"
    );
  return ctx;
};
