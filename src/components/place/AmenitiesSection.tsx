import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wifi, 
  Accessibility, 
  Car, 
  UtensilsCrossed, 
  CreditCard, 
  Dog,
  Calendar,
  Users,
  Wine,
  Music
} from "lucide-react";

interface AmenitiesSectionProps {
  amenities?: string[];
}

const amenityIcons: { [key: string]: any } = {
  "WiFi": Wifi,
  "Wheelchair Accessible": Accessibility,
  "Parking": Car,
  "Outdoor Seating": UtensilsCrossed,
  "Card Payments": CreditCard,
  "Pet Friendly": Dog,
  "Reservations": Calendar,
  "Family Friendly": Users,
  "Wine Bar": Wine,
  "Local Wine": Wine,
  "Live Music": Music
};

export const AmenitiesSection = ({ amenities = [] }: AmenitiesSectionProps) => {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Amenities & Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {amenities.map((amenity) => {
            const Icon = amenityIcons[amenity] || UtensilsCrossed;
            return (
              <div
                key={amenity}
                className="flex items-center gap-2 sm:gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium break-words">
                  {amenity}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
