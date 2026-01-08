export const placesKeys = {
  all: ["places"] as const,
  detail: (placeIdOrGoogleId: string) =>
    [...placesKeys.all, "detail", placeIdOrGoogleId] as const,
};


