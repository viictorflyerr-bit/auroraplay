import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "AURORA PLAY — Histórias que prendem você",
  description:
    "Assista aos melhores ReelShorts em episódios rápidos e emocionantes. Romance, Drama, Mistério, Ação e Fantasia em formato vertical premium.",
  keywords: ["streaming", "reelshort", "novelas", "séries curtas", "aurora play"],
  openGraph: {
    title: "AURORA PLAY",
    description: "Histórias que prendem você do começo ao fim.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
