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
  title: "Harker APCSA",
  description:
    "AP Computer Science A review hub for students of Ms. Anu Datar. Adaptive practice, MCQs with feedback, and teaching slides for every concept.",
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
        <footer className="px-6 py-10 text-center text-sm text-slate-500 space-y-1">
          <div>
            AP Computer Science A · Course taught by{" "}
            <span className="font-display font-semibold text-slate-700">
              Ms. Anu Datar
            </span>
          </div>
          <div className="text-xs">
            Review hub for Harker students · Built with Next.js
          </div>
        </footer>
      </body>
    </html>
  );
}
