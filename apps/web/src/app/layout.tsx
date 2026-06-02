import type { Metadata } from "next";
import { Anton, Oswald } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Forró do Mídia 🔥 — Confirme sua presença",
  description:
    "Você foi CONVOCADO para o Forró do Mídia! Dia 23/06/2026 às 18h. Traje: caipira pressão. Confirme sua presença!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${anton.variable} ${oswald.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
