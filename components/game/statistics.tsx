"use client";
import { Stats } from "@react-three/drei";
type StatsProps = {};

export const Statistics = ({}: StatsProps) => {
  return (
    <>
      <axesHelper args={[5]} />
      <Stats />
    </>
  );
};

