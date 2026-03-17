"use client";

import { CharacterCard } from "@/components/dashboard/character-card";
import { Button } from "@/components/ui/button";
import type { CharacterWithLobby } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CharacterListProps = { characters: CharacterWithLobby[] };

export const CharacterList = ({ characters }: CharacterListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftChevron(scrollLeft > 0);
      setShowRightChevron(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [characters]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, scrollLeft: scrollRef.current?.scrollLeft || 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (!scrollRef.current) return;

    const walk = e.clientX - dragStart.x;
    scrollRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-muted text-lg">No characters available</span>
      </div>
    );
  }

  return (
    <div className="group relative">
      {showLeftChevron && (
        <Button
          variant={"ghost"}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scroll("left");
          }}
          className="absolute top-1/2 left-0 z-50 -translate-y-1/2 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-10" />
        </Button>
      )}

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex w-max flex-nowrap gap-6 px-2 py-2 select-none">
          {characters.map((character) => (
            <div key={character.id} className="shrink-0 md:w-80">
              <CharacterCard character={character} />
            </div>
          ))}
        </div>
      </div>

      {showRightChevron && (
        <Button
          variant={"ghost"}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scroll("right");
          }}
          className="absolute top-1/2 right-0 z-50 -translate-y-1/2 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-10" />
        </Button>
      )}

      {/* Hide scrollbar CSS */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
