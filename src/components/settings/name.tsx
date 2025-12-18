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
  const [name, setName] = useState(user.name);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const accept = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { error } = await authClient.updateUser({ name });
    setLoading(false);
    if (error) {
      toast.error("Could not change username");
      return;
    }
    toast.success("Username successfully changed");
    setOpen(false);
  };

  useEffect(() => {
    open;
    setName(user.name);
  }, [user.name, open]);

  return (
    <ResponsiveDialog
      asChild
      onOpenChange={(v) => !loading && setOpen(v)}
      open={open}
      title="Change username"
      trigger={<Button>Change Name</Button>}
    >
      <div className="flex flex-col gap-6">
        <Input
          autoFocus
          disabled={loading}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your new name"
          type="text"
          value={name}
        />
        <Button disabled={loading || !name.trim()} onClick={accept}>
          {loading ? "Updating..." : "Accept"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
