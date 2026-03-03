"use client";

import React from "react";

type Props = Readonly<{ children: React.ReactNode }>;

export const Mounted = ({ children }: Props): React.ReactNode => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted && children;
};
