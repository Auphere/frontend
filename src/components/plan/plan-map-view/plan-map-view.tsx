"use client";

import { useState, useMemo, useEffect } from "react";
import type { Plan } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface PlanMapViewProps {
  plan: Plan;
  onStopClick?: (index: number) => void;
  activeStopIndex?: number;
}

export function PlanMapView({
  plan,
  onStopClick,
  activeStopIndex = 0,
}: PlanMapViewProps) {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [viewState, setViewState] = useState(() => {
    const firstStop = plan.stops?.[0]?.location;
    return {
      longitude: firstStop?.lng || -0.8890853,
      latitude: firstStop?.lat || 41.6488226,
      zoom: 13,
    };
  });

  // Dynamically import mapbox components on client side only
  // react-map-gl v8 exports from /mapbox subpath
  useEffect(() => {
    Promise.all([
      import("react-map-gl/mapbox"),
      // CSS is optional in some environments/builds; avoid hard-failing.
      import("mapbox-gl/dist/mapbox-gl.css").catch(() => null),
    ]).then(([mod]) => {
      setMapComponents({
        Map: mod.Map,
        Marker: mod.Marker,
        Source: mod.Source,
        Layer: mod.Layer,
      });
    });
  }, []);

  // Create route line between stops
  const routeGeoJSON = useMemo(() => {
    if (!plan.stops || plan.stops.length === 0) {
      return null;
    }

    const coordinates = plan.stops.map((stop) => [
      stop.location.lng,
      stop.location.lat,
    ]);

    return {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates,
      },
    };
  }, [plan.stops]);

  // Route line style
  const routeLayer = {
    id: "route",
    type: "line" as const,
    paint: {
      "line-color": "#8B5CF6",
      "line-width": 3,
      "line-opacity": 0.8,
    },
  };

  // Loading state while map components load
  if (!MapComponents) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-100 md:h-[400px]">
        <div className="text-center">
          <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-purple border-t-transparent" />
          <p className="text-sm text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  // If no Mapbox token, show a fallback
  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-100 md:h-[400px]">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Configura NEXT_PUBLIC_MAPBOX_TOKEN para ver el mapa
          </p>
        </div>
      </div>
    );
  }

  if (!plan.stops || plan.stops.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-100 md:h-[400px]">
        <p className="text-sm text-gray-600">No hay paradas en este plan</p>
      </div>
    );
  }

  const { Map, Marker, Source, Layer } = MapComponents;

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm md:h-[400px]">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Route line */}
        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayer} />
          </Source>
        )}

        {/* Numbered markers for each stop */}
        {plan.stops.map((stop, index) => (
          <Marker
            key={`stop-${stop.local_id}-${index}`}
            longitude={stop.location.lng}
            latitude={stop.location.lat}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              onStopClick?.(index);
            }}
          >
            <div className="relative cursor-pointer">
              {/* Numbered marker */}
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full 
                  border-2 border-white font-bold text-white shadow-lg
                  transition-all hover:scale-110
                  ${
                    activeStopIndex === index
                      ? "scale-125 bg-purple"
                      : "bg-purple/80"
                  }
                `}
              >
                {index + 1}
              </div>

              {/* Pin pointer */}
              <div
                className={`
                  absolute left-1/2 top-full h-0 w-0 -translate-x-1/2
                  border-l-[6px] border-r-[6px] border-t-[8px]
                  border-l-transparent border-r-transparent
                  ${
                    activeStopIndex === index
                      ? "border-t-purple"
                      : "border-t-purple/80"
                  }
                `}
              />

              {/* Tooltip on active */}
              {activeStopIndex === index && (
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-xl">
                  <div className="font-semibold">{stop.name}</div>
                  <div className="text-gray-300">
                    {stop.timing?.recommended_start}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          </Marker>
        ))}

        {/* Travel time labels between stops */}
        {plan.stops.map((stop, index) => {
          if (index === 0) return null;

          const prevStop = plan.stops[index - 1];
          const midLng = (stop.location.lng + prevStop.location.lng) / 2;
          const midLat = (stop.location.lat + prevStop.location.lat) / 2;
          const travelTime = stop.location.travel_time_from_previous_minutes;

          if (!travelTime) return null;

          return (
            <Marker
              key={`distance-${index}`}
              longitude={midLng}
              latitude={midLat}
              anchor="center"
            >
              <div className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-md">
                {travelTime} min
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
