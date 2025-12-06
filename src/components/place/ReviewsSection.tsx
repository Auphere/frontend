import { Star, ThumbsUp, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/types/place";

interface ReviewsSectionProps {
  googleRating?: number;
  googleReviewCount?: number;
  trustpilotRating?: number;
  trustpilotReviewCount?: number;
  reviews?: Review[];
}

export const ReviewsSection = ({
  googleRating,
  googleReviewCount,
  trustpilotRating,
  trustpilotReviewCount,
  reviews = [],
}: ReviewsSectionProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* External Reviews */}
      {(googleRating || trustpilotRating) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              External Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {googleRating && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">G</span>
                  </div>
                  <div>
                    <div className="font-semibold">Google Reviews</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {renderStars(googleRating)}
                      <span className="font-medium">{googleRating}</span>
                      <span>({googleReviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Google
                </Button>
              </div>
            )}

            {trustpilotRating && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      T
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Trustpilot</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {renderStars(trustpilotRating)}
                      <span className="font-medium">{trustpilotRating}</span>
                      <span>({trustpilotReviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Trustpilot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Reviews */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">User Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="space-y-3 pb-6 border-b last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {review.author?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <span className="font-semibold text-sm sm:text-base truncate">
                        {review.author}
                      </span>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <Badge variant="secondary" className="text-xs">
                          {review.rating}/5
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm sm:text-base text-foreground break-words">
                      {review.comment}
                    </p>
                    {review.helpful && (
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2">
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpful})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
