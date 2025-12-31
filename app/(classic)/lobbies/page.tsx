"use client";

import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@/hooks/use-user";
import React, { useState } from "react";

export default function LobbyPage() {
  const user = useUser();
  const { lobbies, activeLobbyId, setActiveLobby, createLobby, sendMessage, joinLobby } =
    useLobby();
  const [newLobbyName, setNewLobbyName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [joinId, setJoinId] = useState("");

  // Select the current active lobby data
  const activeLobby = lobbies.find((l) => l.id === activeLobbyId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLobbyName.trim()) return;
    createLobby(user.id, newLobbyName);
    setNewLobbyName("");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeLobbyId) return;
    sendMessage(user.id, activeLobbyId, messageText);
    setMessageText("");
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinId.trim()) return;
    joinLobby(user.id, joinId);
    setJoinId("");
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100">
      {/* --- Sidebar: Lobby List --- */}
      <aside className="flex w-80 flex-col border-r border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 p-4">
          <h1 className="mb-4 text-xl font-bold">Your Lobbies</h1>

          {/* Create Lobby Form */}
          <form onSubmit={handleCreate} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="New Lobby Name..."
              className="w-full rounded border-none bg-zinc-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={newLobbyName}
              onChange={(e) => setNewLobbyName(e.target.value)}
            />
            <button className="w-full rounded bg-blue-600 py-2 text-sm font-medium transition hover:bg-blue-700">
              Create Room
            </button>
          </form>

          {/* Join Lobby Form */}
          <form onSubmit={handleJoin} className="space-y-2">
            <input
              type="text"
              placeholder="Paste Lobby ID..."
              className="w-full rounded border-none bg-zinc-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
            />
            <button className="w-full rounded bg-green-600 py-2 text-sm font-medium transition hover:bg-green-700">
              Join by ID
            </button>
          </form>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {lobbies.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLobby(l.id)}
              className={`w-full rounded-lg px-3 py-3 text-left transition ${
                activeLobbyId === l.id
                  ? "border border-zinc-700 bg-zinc-800"
                  : "hover:bg-zinc-800/50"
              }`}
            >
              <div className="font-medium">{l.name || "Unnamed Lobby"}</div>
              <div className="truncate text-xs text-zinc-500">
                {l.messages[0]?.content || "No messages yet"}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- Main Chat Area --- */}
      <main className="relative flex flex-1 flex-col">
        {activeLobby ? (
          <>
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6">
              <div>
                <h2 className="text-lg font-bold">{activeLobby.name}</h2>
                <p className="text-xs text-zinc-500">ID: {activeLobby.id}</p>
              </div>
              <div className="flex -space-x-2">
                {activeLobby.members.map((m) => (
                  <div
                    key={m.id}
                    title={m.name}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-700 text-xs"
                  >
                    {m.name[0]}
                  </div>
                ))}
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {activeLobby.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.senderId === user.id ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      m.senderId === user.id
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-100"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="mt-1 text-[10px] text-zinc-600">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <footer className="border-t border-zinc-800 bg-zinc-900 p-4">
              <form onSubmit={handleSend} className="mx-auto flex max-w-4xl gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border-none bg-zinc-800 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 p-2 transition hover:bg-blue-700">
                  ➔
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-zinc-500">
            <p className="text-lg">Select a lobby to start chatting</p>
            <p className="text-sm">Or create a new one in the sidebar</p>
          </div>
        )}
      </main>
    </div>
  );
}

