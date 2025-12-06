import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { PlaceCategory, PlaceVibe } from "@/types/place";

interface FilterBarProps {
  selectedCategory?: PlaceCategory;
  selectedVibe?: PlaceVibe;
  onCategoryChange: (category?: PlaceCategory) => void;
  onVibeChange: (vibe?: PlaceVibe) => void;
  onClearFilters: () => void;
}

const categories: { value: PlaceCategory; label: string }[] = [
  { value: "restaurant", label: "Restaurants" },
  { value: "bar", label: "Bars" },
  { value: "club", label: "Clubs" },
  { value: "cafe", label: "Cafés" },
  { value: "lounge", label: "Lounges" },
  { value: "activity", label: "Activities" }
];

const vibes: { value: PlaceVibe; label: string }[] = [
  { value: "romantic", label: "Romantic" },
  { value: "casual", label: "Casual" },
  { value: "energetic", label: "Energetic" },
  { value: "chill", label: "Chill" },
  { value: "sophisticated", label: "Sophisticated" },
  { value: "fun", label: "Fun" }
];

export const FilterBar = ({
  selectedCategory,
  selectedVibe,
  onCategoryChange,
  onVibeChange,
  onClearFilters
}: FilterBarProps) => {
  const hasFilters = selectedCategory || selectedVibe;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h3 className="font-space-grotesk font-semibold text-lg">Filters</h3>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
            <X className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              className="cursor-pointer hover:border-primary/50 transition-colors px-4 py-2"
              onClick={() => onCategoryChange(selectedCategory === cat.value ? undefined : cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Vibe Filters */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Vibe</label>
        <div className="flex flex-wrap gap-2">
          {vibes.map((vibe) => (
            <Badge
              key={vibe.value}
              variant={selectedVibe === vibe.value ? "default" : "outline"}
              className="cursor-pointer hover:border-primary/50 transition-colors px-4 py-2"
              onClick={() => onVibeChange(selectedVibe === vibe.value ? undefined : vibe.value)}
            >
              {vibe.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
