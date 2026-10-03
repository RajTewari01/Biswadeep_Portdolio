import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { GameProvider } from "@/components/game/GameContext";
import { Space_Grotesk, Syne, Playfair_Display, Pacifico } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Biswadeep Tewari — Digital Nexus",
  description: "Portfolio of Biswadeep Tewari. Full-Stack Engineer, AI/ML Architect, and Mobile Developer. Engineering the impossible.",
  verification: {
    google: "uro1j8pmJ9uk40HfXpBeaA_PmA3S6m3_APoDspkCRJQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#e8f5e9]">
      <body className={`${spaceGrotesk.variable} ${syne.variable} ${playfair.variable} ${pacifico.variable} antialiased bg-[#e8f5e9] text-[#111] selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden`}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
