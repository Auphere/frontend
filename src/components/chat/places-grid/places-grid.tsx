"use client";

import { PlaceCard } from "@/components/place/place-card";
import type { Place } from "@/lib/types";
import { useState } from "react";
import { PlaceDrawer } from "@/components/place/place-card";

interface PlacesGridProps {
  places: Place[];
}

export function PlacesGrid({ places }: PlacesGridProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!places || places.length === 0) return null;

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedPlace(null);
  };

  return (
    <>
      <div className="mt-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">
          📍 Lugares encontrados ({places.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.slice(0, 6).map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => handlePlaceClick(place)}
            />
          ))}
        </div>
        {places.length > 6 && (
          <p className="text-center text-sm text-gray-500">
            Y {places.length - 6} lugares más...
          </p>
        )}
      </div>

      {/* Place Drawer */}
      <PlaceDrawer
        place={selectedPlace}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}

