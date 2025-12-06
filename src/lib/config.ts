/**
 * Application configuration
 */

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const defaultCity =
  import.meta.env.VITE_DEFAULT_CITY ||
  import.meta.env.VITE_PLACES_DEFAULT_CITY ||
  "Zaragoza";

export const config = {
  apiUrl,
  apiVersion: "v1",
  defaultCity,
} as const;

export const API_BASE_URL = `${config.apiUrl}/api/${config.apiVersion}`;

