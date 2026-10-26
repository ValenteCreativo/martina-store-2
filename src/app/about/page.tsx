'use client';

import { Instagram, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 sacred-minimal">
      <div className="content-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div className="mb-12 text-center">
            <div className="flex justify-center gap-2 mb-8">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-wider">Sobre mí</h1>
            <div className="divider my-8" />
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-lg font-light leading-relaxed text-[#c8bfba]">
              Martina Gorozo · Artista multidisciplinaria · Tatuadora · Terapeuta holística.
            </p>
            <p className="text-lg font-light leading-relaxed text-[#c8bfba]">
              He dedicado mi vida entera al arte. Crecí junto a una madre artista conceptual, dibujo y pinto desde niña y mi lenguaje se formó de manera autodidacta. Mexicana y argentina, vivo y trabajo en Ciudad de México.
            </p>
            <p className="text-lg font-light leading-relaxed text-[#c8bfba]">
              Mi propia obra me llevó al estudio de lo esotérico, del tarot y de la geometría sagrada: un lenguaje simbólico que tiende puentes hacia el subconsciente y el alma. De ese camino nació el Tatuaje Ritual.
            </p>
          </div>

          <div className="mt-16 glass-minimal p-12 rounded-lg">
            <h2 className="elegant-text text-sm mb-8 text-center">Reservar una sesión</h2>
            <div className="space-y-4 max-w-md mx-auto">
              <Link
                href="/reservations"
                className="flex items-center justify-center gap-3 btn-elegant w-full text-center"
              >
                <Calendar size={18} />
                Reservar sesión de tatuaje
              </Link>
              <a href="mailto:martinagorozo@gmail.com" className="flex items-center justify-center gap-3 btn-elegant w-full">
                <Mail size={18} />martinagorozo@gmail.com
              </a>
              <a href="https://instagram.com/martina_gorozo" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 btn-elegant w-full">
                <Instagram size={18} />@martina_gorozo
              </a>
            </div>
            <div className="mt-12 text-center">
              <p className="text-sm font-light text-[#c8bfba] leading-relaxed">
                El arte es el portal, la geometría el lenguaje y la brujería la sensibilidad que los une.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
