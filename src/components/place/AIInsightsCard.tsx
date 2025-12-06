import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock, Heart } from "lucide-react";
import { PlaceVibe } from "@/types/place";

interface AIInsightsCardProps {
  vibe: PlaceVibe[];
  crowdLevel: string;
  openNow: boolean;
}

export const AIInsightsCard = ({ vibe, crowdLevel, openNow }: AIInsightsCardProps) => {
  const getBestTimeToVisit = () => {
    if (crowdLevel === "packed" || crowdLevel === "busy") {
      return "Visit during weekday afternoons for a more relaxed experience";
    }
    if (crowdLevel === "quiet" || crowdLevel === "empty") {
      return "Great for a peaceful visit anytime";
    }
    return "Best enjoyed during evening hours for the full atmosphere";
  };

  const getPerfectFor = () => {
    const suggestions: string[] = [];
    
    if (vibe.includes("romantic")) {
      suggestions.push("Date night");
    }
    if (vibe.includes("energetic") || vibe.includes("fun")) {
      suggestions.push("Night out with friends");
    }
    if (vibe.includes("sophisticated")) {
      suggestions.push("Business dinner");
    }
    if (vibe.includes("casual")) {
      suggestions.push("Casual meetups");
    }
    if (vibe.includes("chill")) {
      suggestions.push("Relaxed hangout");
    }

    return suggestions.length > 0 ? suggestions : ["Great for any occasion"];
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm sm:text-base mb-1">Best Time to Visit</h4>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {getBestTimeToVisit()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Heart className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm sm:text-base mb-2">Perfect For</h4>
              <div className="flex flex-wrap gap-2">
                {getPerfectFor().map((suggestion, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-background rounded-full text-xs font-medium border border-primary/20"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {openNow && (
          <div className="pt-3 border-t border-primary/20">
            <p className="text-xs text-muted-foreground italic">
              💡 This place is currently open - great time to visit!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
