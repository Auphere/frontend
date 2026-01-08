import { useQuery } from "@tanstack/react-query";
import { placesAPI } from "@/api-queries/api/places";
import { placesKeys } from "@/api-queries/keys/places";

export function usePlaceDetailQuery(placeIdOrGoogleId?: string | null, enabled?: boolean) {
  return useQuery({
    queryKey: placeIdOrGoogleId ? placesKeys.detail(placeIdOrGoogleId) : placesKeys.all,
    queryFn: async () => {
      if (!placeIdOrGoogleId) throw new Error("Missing place id");
      return placesAPI.getPlaceDetail(placeIdOrGoogleId);
    },
    enabled: !!placeIdOrGoogleId && (enabled ?? true),
  });
}


