import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * BRUTALIST HEADING FONT
 * Space Grotesk — geometric, mechanical, industrial.
 * Used for the chaos layer typography.
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-brutalist",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

/**
 * DIVINE CODE FONT
 * JetBrains Mono — the engineering truth beneath the chaos.
 * Used for the reveal layer (syntax-highlighted source code).
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

/**
 * THRASH METAL FONT
 * The brutal manifesto typography.
 */
export const metalFont = localFont({
  src: "../../public/fonts/pastor_of_muppets.ttf",
  variable: "--font-metal",
  display: "swap",
});
