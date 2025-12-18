"use client";

import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "../layout/toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ResponsiveDialog } from "../ui/responsive-dialog";

export default () => {
  const user = useUser();
  const [email, setEmail] = useState<string>(user.email);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const accept = async () => {
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await authClient.changeEmail({ newEmail: email });
    setLoading(false);
    if (error) {
      toast.error("Could not change email");
      return;
    }
    toast.success("Email successfully changed");
    setOpen(false);
  };

  useEffect(() => {
    open;
    setEmail(user.email);
  }, [user.email, open]);

  return (
    <ResponsiveDialog
      asChild
      onOpenChange={(v) => !loading && setOpen(v)}
      open={open}
      title="Change email"
      trigger={<Button>Change Email</Button>}
    >
      <div className="flex flex-col gap-6">
        <Input
          autoFocus
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your new email"
          type="text"
          value={email}
        />
        <Button disabled={loading || !email.trim()} onClick={accept}>
          {loading ? "Updating..." : "Accept"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
