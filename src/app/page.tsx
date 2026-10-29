'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Instagram, Mail } from 'lucide-react';
import HorizontalScroll from '../components/HorizontalScroll';
import Carousel from '../components/ui/Carousel';
import SectionHeader from '../components/ui/SectionHeader';
import { artworkService } from '../lib/services';
import type { Artwork } from '../types';

const EMAIL = 'martinagorozo@gmail.com';

export default function Home() {
  const [digitalArt, setDigitalArt] = useState<Artwork[]>([]);
  const [tattoos, setTattoos] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const portalRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: portalRef, offset: ['start start', 'end end'] });
  const imageScale = useTransform(scrollYProgress, [0, .56], [1, 4.25]);
  const imageOpacity = useTransform(scrollYProgress, [.20, .56], [1, 0]);
  const veilOpacity = useTransform(scrollYProgress, [.08, .46], [0, .94]);
  const heroOpacity = useTransform(scrollYProgress, [.48, .68], [0, 1]);
  const heroY = useTransform(scrollYProgress, [.48, .68], [26, 0]);
  // The opening title stays continuous: it descends into the hero instead of disappearing.
  const introNameY = useTransform(scrollYProgress, [0, .38, .62], ['0vh', '0vh', '18vh']);
  const introNameScale = useTransform(scrollYProgress, [0, .38, .62], [1, 1, 1.42]);

  useEffect(() => {
    artworkService.getAll().then(({ data }) => {
      const all = data || [];
      setTattoos(all.filter((art) => art.category.toLowerCase().includes('tattoo')).slice(0, 4));
      setDigitalArt(all.filter((art) => !art.category.toLowerCase().includes('tattoo')).slice(0, 4));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return <main className="bg-[#050505] text-[#e5e5e5]">
    <section ref={portalRef} className="relative h-[235vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: reducedMotion ? 1 : imageScale, opacity: imageOpacity }}><Image src="/martina-gorozo-intro.jpg" alt="Martina Gorozo junto a una de sus obras" fill priority quality={90} sizes="100vw" className="object-cover object-[center_42%] grayscale contrast-110 brightness-[.72] md:object-[center_38%]" /></motion.div>
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: veilOpacity, background: 'radial-gradient(ellipse 54% 52% at center, transparent 0%, rgba(5,5,5,.62) 57%, #050505 100%)' }} />
        <motion.div className="pointer-events-none absolute inset-x-0 top-7 z-30 px-6 text-center md:top-10" style={{ y: introNameY, scale: introNameScale }}><span className="text-xl uppercase tracking-[.32em] text-white md:text-3xl" style={{ fontFamily: 'var(--font-heading), serif', textShadow: '0 2px 14px rgba(0,0,0,.95)' }}>Martina Gorozo</span></motion.div>
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-9 z-10 flex flex-col items-center gap-2 text-[9px] uppercase tracking-[.46em] text-[#e5e5e5]/85"><motion.span className="bg-black/25 px-3 py-1 backdrop-blur-[2px]" animate={reducedMotion ? {} : { y: [0, 6, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}>Desliza</motion.span><span className="h-10 w-px bg-white/55" /></motion.div>
        <motion.div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center" style={{ opacity: heroOpacity, y: heroY }}><span className="mb-7 text-[10px] uppercase tracking-[.38em] text-[#a51f2d]">Artista · Tatuadora · CDMX</span><p className="max-w-xl text-base leading-relaxed text-[#e5e5e5] md:text-xl">Artista multidisciplinaria y tatuadora en Ciudad de México. El ojo como portal. La geometría como lenguaje.</p><div className="my-8 h-px w-20 bg-white/70" /><div className="mt-2 flex flex-wrap justify-center gap-3"><Link className="btn-ritual" href="/reservations">Reservar sesión</Link><Link className="btn-ritual" href="/services">Conocer servicios</Link></div><Link href="/tattoos" className="mt-6 text-[10px] uppercase tracking-[.25em] text-white/60 transition hover:text-[#a51f2d]">Ver tatuajes <span aria-hidden="true">→</span></Link></motion.div>
      </div>
    </section>
    <HorizontalScroll className="editorial-grid bg-[#050505]">
      <GalleryPanel index="01" title="Originales y arte digital" subtitle="Portafolio" description="Ojos, raíces y geometrías que vuelven una y otra vez, como un lenguaje que me atraviesa." href="/portfolio" cta="Ver portafolio" artworks={digitalArt} loading={loading} />
      <GalleryPanel index="02" title="Línea fina y microrrealismo" subtitle="Tatuajes" description="Piezas medianas y grandes que armonizan el cuerpo sin invadirlo: botánica, insectos, objetos, ornamento y abstracción orgánica." href="/tattoos" cta="Ver tatuajes" artworks={tattoos} loading={loading} tattoo />
      <section className="relative flex h-screen w-screen flex-shrink-0 items-center px-8 md:px-24"><div className="absolute inset-y-0 left-0 w-px bg-white/10" /><div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><span className="meta-label text-[#a51f2d]">03 · Servicios</span><h2 className="mt-5 text-3xl leading-tight text-white md:text-5xl">Herramientas de reconexión con el Ser.</h2></div><div><p className="max-w-xl text-base leading-relaxed text-[#c8bfba]">Tatuaje Ritual · Tarot evolutivo · Terapia cuántica · Armonización energética</p><p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55">Desde el cuerpo, los símbolos y la energía.</p><Link href="/services" className="btn-ritual mt-8">Ver servicios</Link></div></div></section>
    </HorizontalScroll>
    <footer className="border-t border-white/10 bg-[#080808] py-24"><div className="content-container flex flex-col items-center text-center"><span className="text-[10px] uppercase tracking-[.35em] text-[#a51f2d]">Contacto</span><h2 className="mt-4 text-3xl text-white">Escríbeme</h2><div className="mt-9 flex gap-7"><a aria-label="Instagram" href="https://www.instagram.com/martina_gorozo/" target="_blank" rel="noreferrer" className="text-[#c8bfba] hover:text-[#a51f2d]"><Instagram /></a><a aria-label="Correo" href={`mailto:${EMAIL}`} className="text-[#c8bfba] hover:text-[#a51f2d]"><Mail /></a></div><a href={`mailto:${EMAIL}`} className="mt-5 text-sm text-[#c8bfba] hover:text-white">{EMAIL}</a><nav className="mt-12 flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[.2em] text-white/55"><Link href="/">Inicio</Link><Link href="/portfolio">Portafolio</Link><Link href="/services">Servicios</Link><Link href="/reservations">Reservas</Link><Link href="/about">Sobre mí</Link></nav><p className="mt-12 text-[10px] text-white/35">© 2026 Martina Gorozo. Todos los derechos reservados.</p></div></footer>
  </main>;
}

function GalleryPanel({ index, title, subtitle, description, href, cta, artworks, loading, tattoo = false }: { index: string; title: string; subtitle: string; description: string; href: string; cta: string; artworks: Artwork[]; loading: boolean; tattoo?: boolean }) {
  return <section className="relative flex h-screen w-screen flex-shrink-0 items-center px-8 md:px-24"><div className="absolute inset-y-0 right-0 w-px bg-white/10" /><div className="mx-auto flex h-[74vh] w-full max-w-6xl flex-col"><div className="mb-8 grid gap-5 md:grid-cols-[.55fr_1.45fr] md:items-end"><span className="meta-label text-[#a51f2d]">{index} · {subtitle}</span><div><SectionHeader title={title} align="left" className="mb-3 my-0" /><p className="max-w-2xl text-sm leading-relaxed text-[#c8bfba]">{description}</p></div></div>{loading ? <div className="m-auto h-px w-12 animate-pulse bg-[#a51f2d]" /> : artworks.length ? <Carousel className="w-full">{artworks.map((art) => <Link href={tattoo ? `/tattoos/${art.id}` : `/portfolio/${art.id}`} key={art.id} className="group mr-4 block w-48 flex-shrink-0 md:w-60"><div className="relative mb-4 aspect-[3/4] overflow-hidden border border-white/10 bg-[#0a0a0a] transition-colors duration-500 group-hover:border-[#a51f2d]/70">{art.imageUrl ? <Image src={art.imageUrl} alt={art.title} fill sizes="240px" className="object-cover" /> : <div className="h-full bg-[#111]" />}</div><h3 className="text-xs tracking-[.18em] text-white group-hover:text-[#a51f2d]">{art.title}</h3><p className="mt-1 text-[10px] text-white/45">{[art.technique || art.medium, art.dimensions, art.year].filter(Boolean).join(' · ')}</p></Link>)}</Carousel> : <p className="m-auto text-sm text-white/40">Próximamente.</p>}<Link href={href} className="btn-ritual mt-auto self-start">{cta} <ArrowDown className="ml-2 inline-block size-3 -rotate-90" /></Link></div></section>;
}
