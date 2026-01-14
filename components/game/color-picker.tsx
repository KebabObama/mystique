import { useBuilder } from "@/hooks/use-builder";
import { HexColorPicker } from "react-colorful";
import { Border } from "../ui/border";

export const ColorPicker = () => {
  const color = useBuilder((s) => s.color);
  const setColor = useBuilder((s) => s.setColor);
  return (
    <div className="relative">
      <HexColorPicker color={color} onChange={setColor} />
      <Border />
    </div>
  );
};

