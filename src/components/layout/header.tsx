"use client";

import { Border } from "@/components/ui/border";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export const Header = () => {
  const text = (usePathname() ?? "").split("/")[1];

  return (
    <div className="bg-card relative flex justify-between gap-3 px-2 py-2 text-2xl font-bold capitalize md:hidden">
      <Border />
      {text}
      <SidebarTrigger className="scale-120" />
    </div>
  );
};
