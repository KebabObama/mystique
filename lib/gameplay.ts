import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";

export namespace Gameplay {
  export const moveTo = (characterId: string, position: [number, number]) => {
    const userId = useUser.getState()?.id;
    const instance = useGame.getState().instance;
    const send = useGame.getState().send;
    if (!instance || !userId) return;
    send("character:move", characterId, position);
  };
  export const getValidMoves = (characterId: string, currentPos: [number, number]) => {
    const instance = useGame.getState().instance;
    if (!instance) return [];
    const char = instance.characters.find((c) => c.id === characterId);
    if (!char) return [];
    const { stamina } = char;
    const { walls, positions } = instance.game;
    const possible: [number, number][] = [];
    for (let dx = -stamina; dx <= stamina; dx++) {
      for (let dy = -stamina; dy <= stamina; dy++) {
        const distance = Math.abs(dx) + Math.abs(dy);
        if (distance > 0 && distance <= stamina) {
          const targetX = currentPos[0] + dx;
          const targetY = currentPos[1] + dy;
          const isWall = walls.some(([wx, wy]) => wx === targetX && wy === targetY);
          const isOccupied = Object.entries(positions).some(
            ([id, [px, py]]) => id !== characterId && px === targetX && py === targetY
          );
          if (!isWall && !isOccupied) possible.push([targetX, targetY]);
        }
      }
    }
    return possible;
  };
}

