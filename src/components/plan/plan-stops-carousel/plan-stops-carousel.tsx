"use client";

import { useRef, useEffect } from "react";
import { PlanStopCard } from "./plan-stop-card";
import type { PlanStop } from "@/lib/types";

interface PlanStopsCarouselProps {
  stops: PlanStop[];
  activeIndex?: number;
  onCardChange?: (index: number) => void;
}

export function PlanStopsCarousel({
  stops,
  activeIndex = 0,
  onCardChange,
}: PlanStopsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll when activeIndex changes (e.g., from map click)
  useEffect(() => {
    const activeCard = cardRefs.current[activeIndex];
    if (activeCard && scrollRef.current) {
      activeCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  // Detect manual scroll and update activeIndex
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = 260 + 12; // width + gap

    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < stops.length) {
      onCardChange?.(newIndex);
    }
  };

  if (!stops || stops.length === 0) {
    return (
      <div className="rounded-lg bg-gray-100 p-4 text-center text-sm text-gray-600">
        No hay paradas en este plan
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {stops.map((stop, index) => (
          <div
            key={`stop-${stop.local_id}-${index}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="w-[260px] shrink-0 snap-center first:ml-0 last:mr-0 md:w-[280px]"
            onClick={() => onCardChange?.(index)}
          >
            <PlanStopCard
              stop={stop}
              index={index}
              isActive={index === activeIndex}
            />
          </div>
        ))}
      </div>

      {/* Scroll indicators */}
      <div className="mt-2 flex justify-center gap-1.5">
        {stops.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onCardChange?.(idx)}
            className={`rounded-full transition-all ${
              idx === activeIndex
                ? "h-2 w-4 bg-purple"
                : "h-2 w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ir a parada ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
