"use client";

import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/components/ui/responsive-dialog";
import { useCharacterStore } from "@/hooks/use-create-character";
import { maxStats } from "@/lib/mod";
import React from "react";
import { _Attributes } from "./attribute";
import { _Class } from "./class";
import { _Name } from "./name";
import { _Race } from "./race";
import { _Summary } from "./summary";

enum STEPS {
  "Who are you?",
  "Choose your path",
  "Assign attributes",
  "Name yourself",
  "Is this you?",
}

export const CharacterCreator = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<STEPS>(0);
  const store = useCharacterStore();

  const render = () => {
    switch (step) {
      case STEPS["Who are you?"]:
        return <_Race />;
      case STEPS["Choose your path"]:
        return <_Class />;
      case STEPS["Assign attributes"]:
        return <_Attributes />;
      case STEPS["Name yourself"]:
        return <_Name />;
      case STEPS["Is this you?"]:
        return <_Summary />;
    }
  };

  const next = () => {
    switch (step) {
      case STEPS["Choose your path"]:
      case STEPS["Assign attributes"]:
        store.setCan(false);
        break;
      case STEPS["Name yourself"]:
        const l = maxStats.resources(store.character);
        store.set("resources", l);
        break;
      case STEPS["Is this you?"]:
        console.log(store.character);
        toast.success("Character created successfully");
        setOpen(false);
        break;
    }
    setStep(step + 1);
  };

  return (
    <ResponsiveDialog
      trigger={children}
      title={STEPS[step]}
      description=""
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        setStep(0);
        store.reset();
      }}
      className="min-w-md md:min-w-3xl lg:min-w-4xl"
      footer={
        <Button onClick={next} size="sm" disabled={!store.can}>
          {step === STEPS["Is this you?"] ? "Finish" : "Next"}
        </Button>
      }
    >
      <div className="h-full max-h-140 overflow-auto px-2 py-4">{render()}</div>
    </ResponsiveDialog>
  );
};
