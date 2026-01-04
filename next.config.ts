import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "places.googleapis.com",
        pathname: "/v1/places/**/photos/**/media**",
      },
      // Allow other common image hosting services if needed
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
