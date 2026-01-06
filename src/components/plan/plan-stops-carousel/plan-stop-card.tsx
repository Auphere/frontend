"use client";

import { Clock, Euro, MapPin, Music } from "lucide-react";
import type { PlanStop } from "@/lib/types";

interface PlanStopCardProps {
  stop: PlanStop;
  index: number;
  isActive?: boolean;
}

export function PlanStopCard({ stop, index, isActive }: PlanStopCardProps) {
  // Get category icon
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      restaurant: "🍽️",
      bar: "🍸",
      club: "🎵",
      cafe: "☕",
      activity: "🎯",
      hotel: "🏨",
      cruise: "🚢",
    };
    return icons[category?.toLowerCase()] || "📍";
  };

  return (
    <div
      className={`
        cursor-pointer rounded-xl border bg-white p-3 transition-all
        ${
          isActive
            ? "border-purple shadow-lg ring-2 ring-purple/20"
            : "border-gray-200 shadow hover:border-gray-300 hover:shadow-md"
        }
      `}
    >
      {/* Image placeholder */}
      <div className="relative mb-3 h-28 w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple/10 to-blue-100">
        {/* Stop number badge */}
        <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-purple text-xs font-bold text-white shadow">
          {index + 1}
        </div>
        
        {/* Category icon */}
        <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm">
          {getCategoryIcon(stop.category)}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div>
          <h4 className="line-clamp-1 font-semibold text-gray-900">
            {stop.name}
          </h4>
          <p className="text-xs text-gray-500">
            {stop.type_label || stop.category}
          </p>
        </div>

        {/* Time and price */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          {stop.timing?.recommended_start && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {stop.timing.recommended_start}
            </span>
          )}
          {stop.timing?.suggested_duration_minutes && (
            <span className="text-gray-400">
              {stop.timing.suggested_duration_minutes} min
            </span>
          )}
          {stop.details?.average_spend_per_person && (
            <span className="flex items-center gap-1">
              <Euro className="h-3 w-3" />~{stop.details.average_spend_per_person}€
            </span>
          )}
        </div>

        {/* Vibes */}
        {stop.details?.vibes && stop.details.vibes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {stop.details.vibes.slice(0, 2).map((vibe) => (
              <span
                key={vibe}
                className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700"
              >
                {vibe}
              </span>
            ))}
          </div>
        )}

        {/* Music type if available */}
        {stop.details?.music && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Music className="h-3 w-3" />
            {stop.details.music}
          </div>
        )}

        {/* Travel info to next stop */}
        {stop.location?.travel_time_from_previous_minutes && index > 0 && (
          <div className="border-t border-gray-100 pt-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              {stop.location.travel_mode === "walk" && "🚶"}
              {stop.location.travel_mode === "car" && "🚗"}
              {stop.location.travel_mode === "public" && "🚌"}
              {!stop.location.travel_mode && "🚶"}
              {stop.location.travel_time_from_previous_minutes} min desde anterior
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

