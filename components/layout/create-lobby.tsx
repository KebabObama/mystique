"use client";

import { useLobby } from "@/hooks/use-lobby";
import React from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";

type Props = React.ComponentPropsWithoutRef<typeof Dialog.Trigger>;

export const CreateLobby = (props: Props) => {
  const createLobby = useLobby((s) => s.createLobby);
  const [name, setName] = React.useState("");
  const disabled = name.length === 0;
  return (
    <Dialog>
      <Dialog.Trigger {...props} />
      <Dialog.Content>
        <Dialog.Title>Create new lbby</Dialog.Title>
        <Dialog.Description>
          Want to play or just want to text? Create lobby and see.
        </Dialog.Description>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Dialog.Footer>
          <Button
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createLobby(name);
            }}
          ></Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

