import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useFogOfWar, VisionSource } from "./fog-of-war";

interface PlayerWithVisionProps {
  id: string;
  position: [number, number, number];
  radius?: number;
  range?: number;
  children?: React.ReactNode;
}

export const Player = ({
  id,
  position,
  radius = 1,
  range = 5,
  children,
}: PlayerWithVisionProps) => {
  const { addVisionSource, updateVisionSource, removeVisionSource } = useFogOfWar();
  const lastPositionRef = useRef<[number, number]>([position[0], position[2]]);

  // Add vision source on mount
  useEffect(() => {
    const source: VisionSource = { id, position: [position[0], position[2]], radius, range };

    addVisionSource(source);
    lastPositionRef.current = [position[0], position[2]];

    // Cleanup on unmount
    return () => {
      removeVisionSource(id);
    };
  }, [id, radius, range]);

  // Update vision source position only when it changes
  useFrame(() => {
    const currentPos: [number, number] = [position[0], position[2]];
    const lastPos = lastPositionRef.current;

    // Only update if position changed
    if (currentPos[0] !== lastPos[0] || currentPos[1] !== lastPos[1]) {
      updateVisionSource(id, currentPos);
      lastPositionRef.current = currentPos;
    }
  });

  return <>{children}</>;
};
