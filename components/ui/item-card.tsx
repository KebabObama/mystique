import { Card } from "@/components/ui/card";
import { Game } from "@/lib/game";

export const ItemCard = ({ item }: { item: Game.Character["inventory"][number] }) => {
  return (
    <Card
      key={item.id}
      className={`grid w-full grid-cols-3 p-0 text-xs ${item.equipped ? "bg-background/80" : ""} shadow-sm`}
    >
      <div className="col-span-2 flex w-full flex-col justify-between px-1.5 py-1">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-base font-semibold capitalize">
            {item.quantity}x - {item.name}
          </h1>
          <span className={`text-muted text-end`}>{item.equipped && "Equipped"}</span>
        </div>
        <table className="w-full pb-2 text-left text-xs">
          <thead>
            <tr className="sticky text-center font-semibold">
              <td className="text-start">Name</td>
              <td>Range</td>
              <td>AoE / Hits</td>
              <td>Cost</td>
              <td>Damage / Heal</td>
              <td className="text-end">Effects</td>
            </tr>
          </thead>
          <tbody className="text-muted text-center">
            {item.abilities.map((f) => (
              <tr key={f.name}>
                <td className="text-foreground text-start font-medium">{f.name}</td>
                <td>{f.range}</td>
                <td>
                  {f.targeting < 0 ? "A" : "H"}-{Math.abs(f.targeting)}
                </td>
                <td>{f.cost}</td>
                <td>
                  <span>
                    {f.amount[0] < 0 ? "H" : "D"}: {f.amount[0]} - {f.amount[1]}
                  </span>
                </td>
                <td className="text-end uppercase">
                  {
                    // prettier-ignore
                    Game.KEYS.EFFECTS.reduce((acc, g) => `${acc}${g[0]}${f.effects[g] ?? 0} `, "").trim()
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-muted flex h-full flex-col justify-center border-l-6 px-2 py-1">
        <StatLabel label="Type" value={item.type} />
        <StatLabel label="Value" value={item.value} />
        <StatLabel label="Weight" value={item.weight} />
        {item.armor && <StatLabel label="Armor" value={item.armor} />}
        <StatLabel
          label="require"
          value={Game.KEYS.ATTRIBUTES.map((attr) => item.requiremnts[attr] ?? 0).join("-")}
        />
      </div>
    </Card>
  );
};

const StatLabel = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <p className="flex flex-row justify-between">
    <span className="text-muted capitalize">{label}</span>
    <span className="text-foreground">{value}</span>
  </p>
);
