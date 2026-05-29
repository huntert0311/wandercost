import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Wandercost — Real travel costs from real travelers",
  description: "Discover what travel actually costs. Real crowdsourced cost data from verified travelers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-gray-900">{children}</body>
    </html>
  );
}
