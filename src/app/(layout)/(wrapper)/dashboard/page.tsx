"use client";

import { useUser } from "@/hooks/use-user";

export default () => {
  return <>{useUser().id}</>;
};
