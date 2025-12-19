import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Star,
  MapPin,
  Phone,
  Globe,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Place } from "@/types/place";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/z-index";

interface PlaceDrawerProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: "push" | "overlay"; // New prop for drawer behavior
}

const priceLevelText = (level: number) => "€".repeat(level);

export const PlaceDrawer = ({
  place,
  isOpen,
  onClose,
  variant = "push",
}: PlaceDrawerProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Photo index state - must be declared before any conditional returns
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Prevent body scroll when drawer is open (only on mobile)
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMobile]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Reset photo index when place changes
  useEffect(() => {
    if (place) {
      setCurrentPhotoIndex(0);
    }
  }, [place]);

  if (!place) return null;

  // Handle photo navigation
  const nextPhoto = () => {
    if (place.images && place.images.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % place.images.length);
    }
  };

  const prevPhoto = () => {
    if (place.images && place.images.length > 0) {
      setCurrentPhotoIndex(
        (prev) => (prev - 1 + place.images.length) % place.images.length
      );
    }
  };

  return (
    <>
      {/* Backdrop - for mobile or overlay variant */}
      {(isMobile || variant === "overlay") && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity duration-500 ease-out",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
          style={{ zIndex: Z_INDEX.DRAWER_BACKDROP }}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed bg-background overflow-y-auto shadow-2xl",
          // Mobile: bottom drawer
          isMobile && [
            "inset-x-0 bottom-0 rounded-t-2xl",
            "transition-transform duration-500 ease-out",
            isOpen ? "translate-y-0" : "translate-y-full",
          ],
          // Desktop: right drawer (50% width)
          !isMobile && [
            "top-0 right-0 h-full w-1/2",
            "transition-transform duration-700",
            isOpen ? "translate-x-0" : "translate-x-full",
          ]
        )}
        style={{
          maxHeight: isMobile ? "90vh" : "100vh",
          transitionTimingFunction: !isMobile
            ? "cubic-bezier(0.32, 0.72, 0, 1)"
            : undefined,
          zIndex: Z_INDEX.DRAWER,
        }}
      >
        {/* Mobile Handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>
        )}

        {/* Header with close button */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {!isMobile && <span>{t("common.back")}</span>}
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {place.images && place.images.length > 0 ? (
            <>
              <img
                src={place.images[currentPhotoIndex] || place.images[0]}
                alt={place.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation arrows */}
              {place.images.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              {t("place.noImageAvailable")}
            </div>
          )}

          {/* Photo navigation dots */}
          {place.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {place.images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    idx === currentPhotoIndex ? "bg-white w-6" : "bg-white/60"
                  )}
                />
              ))}
            </div>
          )}

          {/* "Show all photos" button */}
          {place.images.length > 1 && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 text-xs"
            >
              {t("place.showAllPhotos")}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Title and rating */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{place.name}</h1>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{place.rating}</span>
                <span className="text-muted-foreground">
                  ({place.reviewCount?.toLocaleString() || 0})
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {place.neighborhood}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="font-semibold text-primary">
                {priceLevelText(place.priceLevel)}
              </span>
            </div>
          </div>

          {/* Category and vibes */}
          <div className="flex flex-wrap gap-2">
            <Badge className="capitalize">{place.category}</Badge>
            {place.vibe?.slice(0, 3).map((v) => (
              <Badge key={v} variant="outline" className="capitalize">
                {v}
              </Badge>
            ))}
          </div>

          {/* Current status */}
          {place.currentStatus && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">{t("place.rightNow")}</p>
                  <p className="text-sm text-muted-foreground">
                    {place.currentStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Overview section */}
          <div>
            <h3 className="font-semibold mb-3">{t("place.overview")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {place.description ||
                `${place.name} is a ${place.category} located in ${place.neighborhood}.`}
            </p>
          </div>

          {/* Saved by */}
          {place.reviewCount && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 fill-current text-red-500" />
              <span>
                {t(
                  `place.savedBy${
                    Math.floor(place.reviewCount / 10) !== 1 ? "_plural" : ""
                  }`,
                  {
                    count: Math.floor(place.reviewCount / 10),
                  }
                )}
              </span>
            </div>
          )}

          {/* Tabs: Overview, Reviews, Location */}
          <div className="border-b">
            <div className="flex gap-6">
              <button className="pb-3 border-b-2 border-foreground font-medium text-sm">
                {t("place.overview")}
              </button>
              <button className="pb-3 text-muted-foreground hover:text-foreground font-medium text-sm">
                {t("place.reviews")}
              </button>
              <button className="pb-3 text-muted-foreground hover:text-foreground font-medium text-sm">
                {t("place.location")}
              </button>
            </div>
          </div>

          {/* About/Description */}
          <div>
            <h3 className="font-semibold mb-3">{t("place.about")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {place.description ||
                `${place.name} is a distinguished ${place.category} in ${
                  place.neighborhood
                }. 
                Experience the ${
                  place.vibe?.[0] || "unique"
                } atmosphere and enjoy ${place.musicType || "great"} music.`}
            </p>
            {place.description && (
              <button className="text-sm font-medium mt-2 hover:underline">
                {t("place.readMore")}
              </button>
            )}
          </div>

          {/* Features */}
          {place.features && place.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">{t("place.features")}</h3>
              <div className="flex flex-wrap gap-2">
                {place.features.slice(0, 6).map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(place.phone || place.website) && (
            <div>
              <h3 className="font-semibold mb-3">{t("place.contact")}</h3>
              <div className="space-y-2">
                {place.phone && (
                  <a
                    href={`tel:${place.phone}`}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{place.phone}</span>
                  </a>
                )}
                {place.website && (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{place.website}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Ask Mindtrip AI */}
          <div className="sticky bottom-0 bg-background pt-4 border-t">
            <div className="relative">
              <input
                type="text"
                placeholder={t("place.askAuphere")}
                className="w-full px-4 py-3 pr-12 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
