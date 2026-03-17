"use client";

/** Renders the game lobbyId layout. */
export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="size-full"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
};
