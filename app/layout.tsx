import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Literata, Unbounded } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/ui/SiteHeader";

const unbounded = Unbounded({
  variable: "--font-display-family",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-body-family",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-family",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CCA-F Quest — тренажер для Claude Certified Architect",
  description:
    "Ігровий тренажер підготовки до сертифікації Anthropic Claude Certified Architect – Foundations: 5 світів, 30 рівнів, 150 питань, довідник і симуляція екзамену.",
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${unbounded.variable} ${literata.variable} ${jetbrains.variable}`}>
        <div className="layer flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="mt-20 border-t border-hairline px-5 py-6 sm:px-8">
            <p className="eyebrow">
              CCA-F Quest · прогрес зберігається лише у вашому браузері
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
