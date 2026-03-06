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

export const UpdateProfileEmail = ({ user }: { user: User }) => {
  const [email, setEmail] = React.useState(user?.email || "");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!email || email === user.email) return;
    setIsLoading(true);
    try {
      const { error } = await authClient.changeEmail({ newEmail: email });
      if (error) throw new Error(error.message);
      useUser.setState({ email });
      toast.success("Name was successfully changed!");
    } catch (error) {
      toast.error(`Failed to update email: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <section className="bg-card relative flex grow flex-col gap-6 p-6">
      <Border />
      <div className="text-center text-lg font-bold">Change email</div>
      <div className="flex flex-row flex-wrap gap-6">
        <Input
          className="grow"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          type="text"
          placeholder="Enter your email"
          disabled={isLoading}
        />
        <Button
          className="w-full sm:w-9"
          size={"icon"}
          disabled={isLoading || email === user?.email}
          onClick={onSubmit}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
        </Button>
      </div>
    </section>
  );
};
