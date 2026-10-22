'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { artworkService } from '../../lib/services';
import type { Artwork } from '../../types';

type Filter = 'originals' | 'digital' | 'tattoo';

export default function PortfolioPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('originals');

  useEffect(() => { loadArtworks(); }, []);

  async function loadArtworks() {
    try {
      const { data } = await artworkService.getAll();
      setArtworks(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const originals = artworks.filter(a => a.category.toLowerCase().includes('original'));
  const digital = artworks.filter(a => !a.category.toLowerCase().includes('tattoo') && !a.category.toLowerCase().includes('original'));
  const tattoos = artworks.filter(a => a.category.toLowerCase().includes('tattoo'));
  const current = filter === 'originals' ? originals : filter === 'digital' ? digital : tattoos;

  return (
    <main className="min-h-screen pt-28 pb-24 bg-[#050505] text-[#e5e5e5]">
      <div className="content-container max-w-6xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="eyebrow mb-4">Galería · 2024 — 2026</p>
          <h1 className="page-title">Portfolio</h1>
          <p className="mt-6 max-w-2xl mx-auto text-sm leading-relaxed text-[#c8bfba]">Desde niña dibujo ojos sin saber por qué. Con el tiempo entendí que no eran una obsesión, sino un portal: la fractalización del todo experimentándose a sí mismo.</p>
          <div className="h-12 accent-line mt-6" />
        </motion.div>

        {/* ── Tab switcher ── */}
        <div className="flex items-center justify-center mb-14">
          <div className="flex border border-[#1a1a1a]">
            <TabButton active={filter === 'originals'} onClick={() => setFilter('originals')} count={originals.length}>Originales</TabButton>
            <TabButton
              active={filter === 'digital'}
              onClick={() => setFilter('digital')}
              count={digital.length}
            >
              Digital Art
            </TabButton>
            <TabButton
              active={filter === 'tattoo'}
              onClick={() => setFilter('tattoo')}
              count={tattoos.length}
            >
              Ink · Tattoos
            </TabButton>
          </div>
        </div>

        {/* ── Section description ── */}
        <AnimatePresence mode="wait">
          <motion.p
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-center text-[#c8bfba] font-light mb-14 max-w-xl mx-auto leading-relaxed"
            style={{ fontSize: 'var(--text-body)' }}
          >
            {filter === 'originals'
              ? 'Cada pieza es original, única y está firmada.'
              : filter === 'digital' ? 'Obra digital, ojos, raíces y geometrías en constante transformación.' : 'Línea fina y microrrealismo: botánica, insectos, objetos, ornamento y abstracción orgánica.'}
          </motion.p>
        </AnimatePresence>

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
          </div>
        ) : current.length === 0 ? (
          <div className="text-center py-24">
            <p className="meta-label">Próximamente</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {filter === 'digital' ? (
                /* ─── Digital: shop-style grid, portrait cards ─── */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {current.map((art, i) => (
                    <DigitalCard key={art.id} art={art} index={i} />
                  ))}
                </div>
              ) : (
                /* ─── Tattoos: editorial masonry-feel, landscape ratio ─── */
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {current.map((art, i) => (
                    <TattooCard key={art.id} art={art} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </main>
  );
}

/* ─── Tab Button ─── */
function TabButton({
  active, onClick, children, count,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode; count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-8 py-3 transition-all duration-300 group ${
        active
          ? 'bg-[#8a1c1c]/10 text-[#e5e5e5]'
          : 'bg-transparent text-[#9a9a9a] hover:text-[#c8bfba]'
      }`}
      style={{ fontFamily: 'var(--font-cinzel), serif' }}
    >
      {/* active indicator */}
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-px bg-[#8a1c1c]"
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
      )}
      <span className="text-[10px] uppercase tracking-[0.25em]">{children}</span>
      {count > 0 && (
        <span className={`ml-2 text-[9px] ${active ? 'text-[#8a1c1c]' : 'text-[#2a2a2a]'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ─── Digital Art Card — shop/gallery aesthetic ─── */
function DigitalCard({ art, index }: { art: Artwork; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      className="group"
    >
      <Link href={`/portfolio/${art.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden mb-4
                        border border-[#1a1a1a] group-hover:border-[#2a2a2a]
                        transition-colors duration-500">
          {art.imageUrl ? (
            <Image
              src={art.imageUrl}
              alt={art.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#111]" />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500
                          flex items-end justify-between p-4">
            <span className="text-[9px] uppercase tracking-[.18em] text-[#e5e5e5]">Ver obra</span>
          </div>

          {/* Availability dot */}
          {!art.available && (
            <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#8a1c1c] opacity-70" />
          )}
        </div>

        {/* Label */}
        <div className="space-y-1 px-1">
          <h3 className="card-title truncate" style={{ fontSize: 'var(--text-body)' }}>
            {art.title}
          </h3>
          <p className="meta-label">{[art.technique || art.medium, art.dimensions, art.year].filter(Boolean).join(' · ')}</p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Tattoo Card — editorial, no price, organic layout ─── */
function TattooCard({ art, index }: { art: Artwork; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="group break-inside-avoid"
    >
      <Link href={`/tattoos/${art.id}`} className="block">
        <div className="relative overflow-hidden border border-[#1a1a1a]
                        group-hover:border-[#8a1c1c]/30 transition-colors duration-500">
          {/* Dynamic aspect ratio for masonry feel */}
          <div className={`relative bg-[#0a0a0a] ${index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]'}`}>
            {art.imageUrl ? (
              <Image
                src={art.imageUrl}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1200ms] scale-100 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-[#111]" />
            )}

            {/* Bottom label on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-5
                            bg-gradient-to-t from-black/80 to-transparent
                            translate-y-full group-hover:translate-y-0
                            transition-transform duration-500">
              <p className="meta-label text-[#c8bfba]">{art.title}</p>
              {art.year && <p className="meta-label mt-0.5 opacity-50">{art.year}</p>}
            </div>
          </div>
        </div>

        {/* Title below — always visible */}
        <div className="pt-3 pb-2 px-1">
          <h3
            className="font-light tracking-[0.15em] uppercase text-[#e5e5e5] group-hover:text-[#8a1c1c] transition-colors duration-400 truncate"
            style={{ fontFamily: 'var(--font-heading), serif', fontSize: 'var(--text-micro)' }}
          >
            {art.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
