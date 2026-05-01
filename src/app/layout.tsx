import type { Metadata } from "next";
import { Baloo_2, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

const baloo = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harker APCSA — score a 5",
  description:
    "The Harker AP Computer Science A review hub. Adaptive practice, MCQs with intelligent feedback, and Barron-style teaching slides for every concept.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="px-6 py-10 text-center text-sm text-slate-500">
          Built for Harker students · Review by unit · Practice with feedback ·
          {" "}<span className="font-display text-indigo-700">Score a 5.</span>
        </footer>
      </body>
    </html>
  );
}
