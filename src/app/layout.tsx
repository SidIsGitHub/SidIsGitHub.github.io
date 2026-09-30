import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siddhant Bansod | Repel Mediocrity",
  description: "Systems architecture, autonomous hardware, and kinetic engineering. The technical dossier of Siddhant Bansod.",
  metadataBase: new URL("https://siddhantbansod.me"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-white bg-black selection:bg-[#D41111] selection:text-white">
        {children}
      </body>
    </html>
  );
}