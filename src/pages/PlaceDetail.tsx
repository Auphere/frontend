import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Clock,
  Users,
  Music,
  ArrowLeft,
  Phone,
  Globe,
  Mail,
  Share2,
  Navigation as NavigationIcon,
  Instagram,
  Facebook,
  Loader2,
} from "lucide-react";
import { PhotoGallery } from "@/components/place/PhotoGallery";
import { ReviewsSection } from "@/components/place/ReviewsSection";
import { PopularTimesChart } from "@/components/place/PopularTimesChart";
import { AmenitiesSection } from "@/components/place/AmenitiesSection";
import { RecommendedPlaces } from "@/components/place/RecommendedPlaces";
import { AIInsightsCard } from "@/components/place/AIInsightsCard";
import { usePlaceDetails } from "@/api-queries/query/places.query";
import type { Place as APIPlace } from "@/api-queries/types/places.types";
import type {
  Place,
  PlaceCategory,
  PlaceVibe,
  CrowdLevel,
  MusicType,
} from "@/types/place";

// Image placeholder
const IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop";

// Helper: Map API types to category
const mapTypesToCategory = (types: string[]): PlaceCategory => {
  const typeMap: Record<string, PlaceCategory> = {
    restaurant: "restaurant",
    bar: "bar",
    night_club: "club",
    cafe: "cafe",
    lounge: "lounge",
    activity: "activity",
  };

  for (const type of types) {
    if (typeMap[type]) return typeMap[type];
  }
  return "restaurant";
};

// Helper: Transform API Place to frontend Place
const transformAPIPlaceToDetail = (apiPlace: APIPlace): Place => {
  const customAttributes = apiPlace.customAttributes ?? {};
  const vibes = (customAttributes.vibes as PlaceVibe[]) || ["casual"];

  // Extract photos
  const photos =
    (customAttributes.photos as Array<{
      photo_reference: string;
      attributions?: string[];
      is_primary?: boolean;
    }>) || [];

  const primaryPhoto = customAttributes.primary_photo as
    | {
        photo_reference: string;
        attributions?: string[];
      }
    | undefined;

  const images: string[] = [];
  if (primaryPhoto?.photo_reference) {
    images.push(primaryPhoto.photo_reference);
  }
  photos.forEach((photo) => {
    if (
      photo.photo_reference &&
      photo.photo_reference !== primaryPhoto?.photo_reference
    ) {
      images.push(photo.photo_reference);
    }
  });

  if (images.length === 0) {
    images.push(IMAGE_PLACEHOLDER);
  }

  // Extract reviews
  const apiReviews =
    (customAttributes.reviews as Array<{
      author_name: string;
      author_url?: string;
      profile_photo_url?: string;
      rating: number;
      relative_time_description: string;
      text: string;
      time: number;
    }>) || [];

  const reviews = apiReviews.map((review) => ({
    id: `${review.author_name}-${review.time}`,
    author: review.author_name,
    avatar: review.profile_photo_url,
    rating: review.rating,
    date: review.relative_time_description,
    comment: review.text,
    helpful: 0,
  }));

  const neighborhood =
    apiPlace.vicinity ||
    apiPlace.formattedAddress?.split(",")[1]?.trim() ||
    "Unknown";

  return {
    id: apiPlace.placeId,
    name: apiPlace.name,
    category: mapTypesToCategory(apiPlace.types),
    description: apiPlace.formattedAddress || neighborhood,
    vibe: vibes.length > 0 ? vibes : ["casual"],
    crowdLevel: (customAttributes.occupancy as CrowdLevel) || "moderate",
    musicType: (customAttributes.musicType as MusicType) || "ambient",
    priceLevel: (apiPlace.priceLevel || 2) as 1 | 2 | 3 | 4,
    rating: apiPlace.rating || 0,
    reviewCount: apiPlace.userRatingsTotal || 0,
    address: apiPlace.formattedAddress || apiPlace.vicinity || "",
    neighborhood,
    distance: apiPlace.distanceKm,
    openNow: apiPlace.isOpen !== false,
    openingHours: apiPlace.openingHours?.weekday_text?.join(", "),
    images,
    features: [], // TODO: Map from amenities
    currentStatus: customAttributes.liveMusic
      ? "Live music tonight!"
      : undefined,
    googleRating: apiPlace.rating,
    googleReviewCount: apiPlace.userRatingsTotal,
    reviews: reviews.length > 0 ? reviews : undefined,
    phone: apiPlace.phoneNumber,
    website: apiPlace.website,
    amenities: customAttributes.outdoorSeating
      ? ["Outdoor Seating"]
      : undefined,
    weeklyHours: apiPlace.openingHours?.weekday_text
      ? Object.fromEntries(
          apiPlace.openingHours.weekday_text.map((text: string) => {
            const [day, ...hours] = text.split(": ");
            return [day, hours.join(": ")];
          })
        )
      : undefined,
  };
};

const PlaceDetail = () => {
  const { id } = useParams();
  const { data: apiPlace, isLoading, isError } = usePlaceDetails(id || null);

  // Transform API place to frontend format
  const place = apiPlace ? transformAPIPlaceToDetail(apiPlace) : null;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6">
          <div className="container mx-auto py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading place details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (isError || !place) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6">
          <div className="container mx-auto py-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold mb-4">
              {isError ? "Error loading place" : "Place not found"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isError
                ? "We couldn't load this place. Please try again later."
                : "This place doesn't exist or has been removed."}
            </p>
            <Link to="/explore">
              <Button>Back to Explore</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const crowdLevelColors = {
    empty: "bg-success/20 text-success",
    quiet: "bg-success/30 text-success",
    moderate: "bg-warning/20 text-warning",
    busy: "bg-warning/30 text-warning",
    packed: "bg-destructive/20 text-destructive",
  };

  const priceLevelText = (level: number) => "€".repeat(level);

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16 sm:pt-20">
        {/* Hero Image - Mobile Optimized */}
        <section className="relative h-56 sm:h-72 md:h-96 overflow-hidden">
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Back Button */}
          <Link to="/explore">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 left-3 sm:top-6 sm:left-6 bg-background/90 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>

          {/* Share Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-3 sm:top-6 sm:right-6 bg-background/90 backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </section>

        {/* Content */}
        <section className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Header - Mobile First */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk font-bold mb-3 break-words">
                    {place.name}
                  </h1>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="break-words">{place.address}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize ml-5 sm:ml-0">
                      {place.neighborhood}
                    </span>
                  </div>

                  {/* Rating - Stacked on mobile */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-card border border-border px-3 sm:px-4 py-2 rounded-lg">
                      <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-primary text-primary" />
                      <div>
                        <div className="font-bold text-base sm:text-lg">
                          {place.rating}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {place.reviewCount} reviews
                        </div>
                      </div>
                    </div>
                    {place.openNow && (
                      <Badge className="bg-success/20 text-success border-success/30 text-xs sm:text-sm">
                        Open Now
                      </Badge>
                    )}
                  </div>

                  {/* Vibe Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className="capitalize bg-primary text-primary-foreground text-xs sm:text-sm">
                      {place.category}
                    </Badge>
                    {place.vibe.map((v) => (
                      <Badge
                        key={v}
                        variant="outline"
                        className="capitalize text-xs sm:text-sm"
                      >
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current Status */}
                {place.currentStatus && (
                  <Card className="p-3 sm:p-4 bg-primary/10 border-primary/30">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 sm:mt-2 animate-pulse flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 text-sm sm:text-base">
                          Right Now
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">
                          {place.currentStatus}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Photo Gallery */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-space-grotesk font-bold mb-3 sm:mb-4">
                    Photos
                  </h2>
                  <PhotoGallery images={place.images} placeName={place.name} />
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-space-grotesk font-bold mb-3">
                    About
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed break-words">
                    {place.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-space-grotesk font-bold mb-3">
                    Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {place.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Atmosphere Details */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-space-grotesk font-bold mb-4">
                    Atmosphere
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <Card className="p-3 sm:p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-sm sm:text-base">
                          Crowd Level
                        </h3>
                      </div>
                      <p
                        className={`inline-block px-2.5 sm:px-3 py-1 rounded-lg font-medium capitalize text-xs sm:text-sm ${
                          crowdLevelColors[place.crowdLevel]
                        }`}
                      >
                        {place.crowdLevel}
                      </p>
                    </Card>

                    <Card className="p-3 sm:p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Music className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-sm sm:text-base">
                          Music
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                        {place.musicType}
                      </p>
                    </Card>
                  </div>
                </div>

                {/* Amenities */}
                <AmenitiesSection amenities={place.amenities} />

                {/* Popular Times */}
                <PopularTimesChart popularTimes={place.popularTimes} />

                {/* Reviews */}
                <ReviewsSection
                  googleRating={place.googleRating}
                  googleReviewCount={place.googleReviewCount}
                  trustpilotRating={place.trustpilotRating}
                  trustpilotReviewCount={place.trustpilotReviewCount}
                  reviews={place.reviews}
                />

                {/* Contact & Hours - Mobile Inline */}
                <div className="lg:hidden space-y-4">
                  {/* Quick Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">
                        Quick Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <span className="text-sm text-muted-foreground">
                          Price Level
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {priceLevelText(place.priceLevel)}
                        </span>
                      </div>

                      {place.distance && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">Distance</div>
                            <div className="text-sm text-muted-foreground">
                              {place.distance} km away
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  {(place.phone || place.website || place.email) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">
                          Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {place.phone && (
                          <a
                            href={`tel:${place.phone}`}
                            className="flex items-center gap-3 hover:text-primary transition-colors"
                          >
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm break-all">
                              {place.phone}
                            </span>
                          </a>
                        )}
                        {place.website && (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 hover:text-primary transition-colors"
                          >
                            <Globe className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm break-all">
                              {place.website}
                            </span>
                          </a>
                        )}
                        {place.email && (
                          <a
                            href={`mailto:${place.email}`}
                            className="flex items-center gap-3 hover:text-primary transition-colors"
                          >
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm break-all">
                              {place.email}
                            </span>
                          </a>
                        )}
                        {place.socialMedia && (
                          <div className="flex gap-3 pt-2 border-t">
                            {place.socialMedia.instagram && (
                              <a
                                href={`https://instagram.com/${place.socialMedia.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                <Instagram className="w-5 h-5" />
                              </a>
                            )}
                            {place.socialMedia.facebook && (
                              <a
                                href={`https://facebook.com/${place.socialMedia.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                <Facebook className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Hours */}
                  {place.weeklyHours && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Opening Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Object.entries(place.weeklyHours).map(
                          ([day, hours]) => (
                            <div
                              key={day}
                              className="flex justify-between text-sm"
                            >
                              <span className="font-medium">{day}</span>
                              <span className="text-muted-foreground">
                                {hours}
                              </span>
                            </div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full" size="lg">
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    {place.phone && (
                      <Button variant="outline" className="w-full" size="lg">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Place
                      </Button>
                    )}
                    {place.website && (
                      <Button variant="outline" className="w-full" size="lg">
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                  </div>

                  {/* Add to Plan */}
                  <Card className="p-4 bg-primary/10 border-primary/30">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">
                      Add to Evening Plan
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      Include this place in your personalized evening plan
                    </p>
                    <Link to="/planner">
                      <Button variant="outline" className="w-full">
                        Create Plan
                      </Button>
                    </Link>
                  </Card>

                  {/* AI Insights */}
                  <AIInsightsCard
                    vibe={place.vibe}
                    crowdLevel={place.crowdLevel}
                    openNow={place.openNow}
                  />
                </div>
              </div>

              {/* Desktop Sidebar - Hidden on mobile */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Quick Info Card */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b">
                        <span className="text-sm text-muted-foreground">
                          Price Level
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {priceLevelText(place.priceLevel)}
                        </span>
                      </div>

                      {place.distance && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">Distance</div>
                            <div className="text-sm text-muted-foreground">
                              {place.distance} km away
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  {(place.phone || place.website || place.email) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {place.phone && (
                          <a
                            href={`tel:${place.phone}`}
                            className="flex items-center gap-3 hover:text-primary transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm break-all">
                              {place.phone}
                            </span>
                          </a>
                        )}
                        {place.website && (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 hover:text-primary transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            <span className="text-sm break-all truncate">
                              {place.website}
                            </span>
                          </a>
                        )}
                        {place.email && (
                          <a
                            href={`mailto:${place.email}`}
                            className="flex items-center gap-3 hover:text-primary transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="text-sm break-all">
                              {place.email}
                            </span>
                          </a>
                        )}
                        {place.socialMedia && (
                          <div className="flex gap-3 pt-2 border-t">
                            {place.socialMedia.instagram && (
                              <a
                                href={`https://instagram.com/${place.socialMedia.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                <Instagram className="w-5 h-5" />
                              </a>
                            )}
                            {place.socialMedia.facebook && (
                              <a
                                href={`https://facebook.com/${place.socialMedia.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                <Facebook className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Hours */}
                  {place.weeklyHours && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Object.entries(place.weeklyHours).map(
                          ([day, hours]) => (
                            <div
                              key={day}
                              className="flex justify-between text-sm"
                            >
                              <span className="font-medium">{day}</span>
                              <span className="text-muted-foreground">
                                {hours}
                              </span>
                            </div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full" size="lg">
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    {place.phone && (
                      <Button variant="outline" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                    {place.website && (
                      <Button variant="outline" className="w-full">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                  </div>

                  {/* Add to Plan */}
                  <Card className="p-4 bg-primary/10 border-primary/30">
                    <h3 className="font-semibold mb-2">Add to Evening Plan</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Include this place in your personalized evening plan
                    </p>
                    <Link to="/planner">
                      <Button variant="outline" className="w-full">
                        Create Plan
                      </Button>
                    </Link>
                  </Card>

                  {/* AI Insights */}
                  <AIInsightsCard
                    vibe={place.vibe}
                    crowdLevel={place.crowdLevel}
                    openNow={place.openNow}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Places */}
        {/* TODO: Implement recommendations API endpoint */}
        {/* <RecommendedPlaces places={[]} currentPlaceId={place.id} /> */}
      </main>

      <Footer />
    </div>
  );
};

export default PlaceDetail;
