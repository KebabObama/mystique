import PixelTrail from "@/components/ui/hover-background";

export default function Home() {
  return (
    <main className="h-dvh w-dvw">
      <PixelTrail
        gridSize={75}
        trailSize={0.025}
        maxAge={200}
        interpolate={4}
        color="#fff"
        gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
      />
    </main>
  );
}
