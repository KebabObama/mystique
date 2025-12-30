"use client";

import { usePathname } from "next/navigation";
import { Border } from "../ui/border";
import { SidebarTrigger } from "../ui/sidebar";

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
