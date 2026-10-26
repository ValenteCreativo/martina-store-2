import type { Metadata } from "next";
import { Bodoni_Moda, DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "../components/ui/Navigation";
import Providers from "./providers";

const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], weight: ["400", "500", "600"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Martina Gorozo · Arte y tatuaje en CDMX",
  description: "Artista multidisciplinaria y tatuadora en Ciudad de México. Línea fina, microrrealismo y geometría sagrada. Piezas medianas y grandes, y Tatuaje Ritual.",
  icons: {
    icon: '/Heart.png',
    apple: '/Heart.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body className={`${bodoni.variable} ${dmSans.variable} antialiased sacred-bg`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
