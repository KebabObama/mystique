"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import React from "react";

type GameProps = { children: React.ReactNode; lobbyId: string };

export const Main = ({ children, lobbyId }: GameProps) => {
  const mobile = useIsMobile();

  if (mobile) {
    return (
      <section className="flex size-full flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-destructive text-2xl font-bold">Mobiles are not supported yet.</h1>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </section>
    );
  }

  return <Canvas camera={{ position: [10, 10, 10] }}>{children}</Canvas>;
};
