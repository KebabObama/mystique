type GameState = {
  user: {
    mode: "play" | "edit" | "create" | "delete";
    dm: boolean;
    setMode(mode: GameState["user"]["mode"]): void;
    loadDm(): void;
  };
  order: { sequence: string[]; current: number; nextTurn(): void };
};

// export const useGame = create<GameState>()((set, get) => ({}));

