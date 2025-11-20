"use client";

import { usePathname } from "next/navigation";
import Card from "../ui/card";
import { SidebarTrigger } from "../ui/sidebar";

export const Header = () => {
  const text = (usePathname() as string).split("/")[1];

  return (
    <Card className="py-2! md:hidden">
      <Card.Content className="flex flex-row items-center justify-between gap-3 text-3xl capitalize">
        {text}
        <SidebarTrigger className="scale-120" />
      </Card.Content>
    </Card>
  );
};
