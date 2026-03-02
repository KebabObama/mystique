"use client";

type Props = { position: { x: number; y: number; z: number } };

export const FloorGrid = ({ position }: Props) => {
  return <gridHelper args={[50, 50, "#444444"]} position={[position.x, position.y, position.z]} />;
};
