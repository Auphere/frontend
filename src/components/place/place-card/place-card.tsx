"use client";

import { Place } from "@/lib/types";
import Image from "next/image";
import { MapPin, Star, Clock, Phone, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaceDetailQuery } from "@/api-queries/queries/places";

export interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-orange-600";
  };

  const imageUrl = place.images && place.images.length > 0 
    ? place.images[0] 
    : "/assets/place-placeholder.png";

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-purple hover:shadow-lg"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={place.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Category badge */}
        <div className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {place.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1">
          {place.name}
        </h3>

        {/* Rating */}
        {place.rating && (
          <div className="mb-2 flex items-center gap-2">
            <Star
              className={`h-4 w-4 fill-current ${getRatingColor(place.rating)}`}
            />
            <span className={`font-medium ${getRatingColor(place.rating)}`}>
              {place.rating.toFixed(1)}
            </span>
            {place.reviewCount && (
              <span className="text-sm text-gray-500">
                ({place.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Address */}
        <div className="mb-3 flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="line-clamp-2">{place.address}</span>
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {place.description}
          </p>
        )}
      </div>
    </div>
  );
}

export interface PlaceDrawerProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlan?: (placeId: string) => void;
}

export function PlaceDrawer({
  place,
  isOpen,
  onClose,
  onAddToPlan,
}: PlaceDrawerProps) {
  if (!place || !isOpen) return null;

  const placeIdentifier = place.place_id || place.id;
  const detailQuery = usePlaceDetailQuery(placeIdentifier, isOpen);
  const detailedPlace = detailQuery.data ?? place;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-orange-600";
  };

  const imageUrl = detailedPlace.images && detailedPlace.images.length > 0
    ? detailedPlace.images[0]
    : "/assets/place-placeholder.png";

  const reviews = Array.isArray(detailedPlace.reviews) ? detailedPlace.reviews : [];
  const tips = Array.isArray((detailedPlace as any).tips)
    ? (detailedPlace as any).tips
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 md:items-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close drawer"
      />
      
      {/* Drawer */}
      <div className="relative h-[90vh] w-full animate-in slide-in-from-bottom md:h-[85vh] md:w-[480px] md:animate-in md:slide-in-from-right">
        <div className="flex h-full flex-col rounded-t-2xl bg-white shadow-2xl md:rounded-l-2xl md:rounded-tr-none">
          {/* Header */}
          <div className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={detailedPlace.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-6 py-4">
            {detailQuery.isFetching && (
              <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                Cargando detalle del lugar…
              </div>
            )}

            {/* Title */}
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              {detailedPlace.name}
            </h2>

            {/* Category badge */}
            <span className="inline-block rounded-full bg-purple/10 px-3 py-1 text-sm font-medium text-purple">
              {detailedPlace.category}
            </span>

            {/* Rating */}
            {detailedPlace.rating && (
              <div className="mt-4 flex items-center gap-2">
                <Star
                  className={`h-5 w-5 fill-current ${getRatingColor(detailedPlace.rating)}`}
                />
                <span className={`text-lg font-semibold ${getRatingColor(detailedPlace.rating)}`}>
                  {detailedPlace.rating.toFixed(1)}
                </span>
                {detailedPlace.reviewCount && (
                  <span className="text-gray-600">
                    ({detailedPlace.reviewCount} reseñas)
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {detailedPlace.description && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold text-gray-900">
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {detailedPlace.description}
                </p>
              </div>
            )}

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-900">Información</h3>

              {/* Address */}
              {detailedPlace.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-gray-500" />
                  <span className="text-gray-700">{detailedPlace.address}</span>
                </div>
              )}

              {/* Open now */}
              {detailedPlace.openNow !== undefined && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-gray-500" />
                  <span className={detailedPlace.openNow ? "text-green-600" : "text-red-600"}>
                    {detailedPlace.openNow ? "Abierto ahora" : "Cerrado"}
                  </span>
                </div>
              )}

              {/* Phone */}
              {detailedPlace.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-gray-500" />
                  <a
                    href={`tel:${detailedPlace.phone}`}
                    className="text-purple hover:underline"
                  >
                    {detailedPlace.phone}
                  </a>
                </div>
              )}

              {/* Website */}
              {detailedPlace.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 shrink-0 text-gray-500" />
                  <a
                    href={detailedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple hover:underline"
                  >
                    Sitio web
                  </a>
                </div>
              )}
            </div>

            {/* Vibe tags */}
            {detailedPlace.vibe && detailedPlace.vibe.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Ambiente
                </h3>
                <div className="flex flex-wrap gap-2">
                  {detailedPlace.vibe.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-gray-900">Reseñas</h3>
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((r: any, idx: number) => (
                    <div
                      key={r?.id || r?.source_id || idx}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-gray-900">
                          {r?.author_name || r?.author || "Usuario"}
                        </div>
                        {typeof r?.rating === "number" && (
                          <div className="text-sm text-gray-700">
                            {r.rating.toFixed(1)} ★
                          </div>
                        )}
                      </div>
                      {r?.text && (
                        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                          {r.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips (Foursquare) */}
            {tips.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-gray-900">Tips</h3>
                <div className="space-y-3">
                  {tips.slice(0, 5).map((t: any, idx: number) => (
                    <div
                      key={t?.id || t?.source_id || idx}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {t?.author || "Foursquare"}
                      </div>
                      {t?.text && (
                        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                          {t.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            {onAddToPlan && (
              <Button
                className="w-full bg-gradient-primary text-white hover:opacity-90"
                onClick={() => onAddToPlan(place.id)}
              >
                Agregar a mi plan
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

