import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Auth0ProviderWrapper } from "@/lib/providers/auth0-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Auphere - Tu asistente de salidas nocturnas",
  description: "Descubre lugares y planifica tus salidas nocturnas con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <Auth0ProviderWrapper>
          <QueryProvider>{children}</QueryProvider>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}
