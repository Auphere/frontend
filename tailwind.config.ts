import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/api-queries/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Brand
        magenta: "#D511FD",
        purple: "#8A43E1",
        orange: "#EF7B16",
        red: "#FF2F2F",

        // Neutrals
        white: "#FFFFFF",
        light: "#F6F5F4", // Background light color
        gray: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          400: "#A1A1AA",
          600: "#52525B",
          900: "#18181B",
        },

        // Semantic
        success: "#22C55E",
        warning: "#EF7B16",
        error: "#FF2F2F",
        info: "#8A43E1",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #D511FD 0%, #8A43E1 100%)",
        "gradient-warm": "linear-gradient(135deg, #EF7B16 0%, #FF2F2F 100%)",
        "gradient-full":
          "linear-gradient(135deg, #D511FD 0%, #8A43E1 50%, #EF7B16 100%)",
        "gradient-auphere":
          "linear-gradient(90deg, #d511fd 0%, #8a43e1 33%, #ef7b16 66%, #ff2f2f 100%)",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.15)",
      },
      fontFamily: {
        sans: [
          "var(--font-space-grotesk)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontWeight: {
        normal: "400",
        semibold: "600",
        bold: "700",
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["1.875rem", { lineHeight: "1.3", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        tiny: ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
    },
  },
};

export default config;
