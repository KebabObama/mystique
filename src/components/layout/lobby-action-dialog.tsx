"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

type LobbyActionDialogProps = {
  title: string;
  description: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  submitLabel: string;
  trigger: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
};

export const LobbyActionDialog = ({
  title,
  description,
  value,
  onValueChange,
  onSubmit,
  submitLabel,
  trigger,
  disabled = false,
  placeholder,
}: LobbyActionDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = React.useCallback(() => {
    if (disabled) return;
    onSubmit(value);
    onValueChange("");
    setOpen(false);
  }, [disabled, onSubmit, onValueChange, value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Input
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            handleSubmit();
          }}
        />
        <Dialog.Footer>
          <Button type="submit" disabled={disabled} onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
