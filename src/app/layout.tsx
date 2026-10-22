import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navigation from "../components/ui/Navigation";
import Providers from "./providers";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

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
      <body className={`${cinzel.variable} ${cormorant.variable} antialiased sacred-bg`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
