"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SELECTION_MODES,
  TOOLS,
  useBuilder,
  type SelectionMode,
  type Tool,
} from "@/hooks/use-builder";

export const BuilderToolbar = () => {
  const { tool, setTool, selectionMode, setSelectionMode } = useBuilder();

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-6">
      <Select value={tool} onValueChange={(v) => setTool(v as Tool)}>
        <SelectTrigger className="capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TOOLS.map((t) => (
            <SelectItem key={t} value={t} className="capitalize">
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectionMode} onValueChange={(v) => setSelectionMode(v as SelectionMode)}>
        <SelectTrigger className="capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SELECTION_MODES.map((m) => (
            <SelectItem key={m} value={m} className="capitalize">
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
