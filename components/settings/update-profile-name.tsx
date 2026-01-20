"use client";

import { toast } from "@/components/layout/toast";
import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/utils";
import { User } from "better-auth";
import { Loader2, Save } from "lucide-react";
import React from "react";

export const UpdateProfileName = ({ user }: { user?: User }) => {
  const [name, setName] = React.useState<string>(user?.name || "");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!name || name === user?.name) return;
    console.log(name);
    setIsLoading(true);
    try {
      const { error } = await authClient.updateUser({ name });
      if (error) throw new Error(error.message);
      useUser.setState({ name });
      toast.success("Name was successfully changed!");
    } catch (error) {
      toast.error(`Failed to update name: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <section className="bg-card relative flex grow flex-col gap-6 p-6">
      <Border />
      <div className="text-center text-lg font-bold">Change name</div>
      <div className="flex flex-row flex-wrap gap-6">
        <Input
          className="grow"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          type="text"
          placeholder="Enter your name"
          disabled={isLoading}
        />
        <Button
          className="w-full sm:w-9"
          size={"icon"}
          disabled={isLoading || name === user?.name}
          onClick={onSubmit}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
        </Button>
      </div>
    </section>
  );
};
