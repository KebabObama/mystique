import PixelTrail from "@/components/ui/hover-background";

export default function Home() {
  return (
    <main className="h-dvh w-dvw">
      <PixelTrail
        gridSize={50}
        trailSize={0.03}
        maxAge={250}
        interpolate={5}
        color="#fff"
        gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
      />
    </main>
  );
}
