/**
 * TypeScript types for Geocoding API responses and requests
 */

// Location interface
export interface Location {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Google Places Autocomplete Prediction
export interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

// Autocomplete Response
export interface AutocompleteResponse {
  predictions: AutocompletePrediction[];
  status: string;
}

// Place Details Response
export interface PlaceDetailsResponse {
  result: {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  };
  status: string;
}

// Address Component
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Geocoding Result
export interface GeocodingResult {
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
}

// Reverse Geocoding Response
export interface ReverseGeocodeResponse {
  results: GeocodingResult[];
  status: string;
}
