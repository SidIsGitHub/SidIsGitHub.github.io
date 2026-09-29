import type { Metadata } from "next";
import { spaceGrotesk, jetbrainsMono, metalFont } from "@/lib/fonts";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIDDHANT BANSOD",
  description:
    "I am not a portfolio. I am a disruption. Engineer. Artist. The chaos is the point.",
  keywords: [
    "Siddhant Bansod",
    "creative engineer",
    "portfolio",
    "frontend developer",
    "artist",
  ],
  authors: [{ name: "Siddhant Bansod" }],
  openGraph: {
    title: "SIDDHANT BANSOD",
    description: "The chaos is the point.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${metalFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-black text-white grain-overlay">
        {/* Global SVG Noise Overlay */}
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.08] mix-blend-multiply" 
          style={{ 
            backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')` 
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
