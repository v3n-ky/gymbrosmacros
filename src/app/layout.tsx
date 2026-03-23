import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GymBros Macros | Australian Fast Food Macro Calculator",
    template: "%s | GymBros Macros",
  },
  description:
    "Calculate macros for your favourite Australian fast food chains. Subway, GYG, Fishbowl, Grill'd, Oporto, Nando's and more.",
  keywords: [
    "macros",
    "fast food",
    "australia",
    "nutrition",
    "protein",
    "calories",
    "gym",
    "fitness",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
