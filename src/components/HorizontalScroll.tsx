'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import LeatherGrain from './LeatherGrain';
import RitualCursor from './RitualCursor';

interface HorizontalScrollProps { children: React.ReactNode; className?: string; }

const panelNames = ['Obra', 'Tatuajes', 'Servicios'];

/** A vertical scroll drives the horizontal gallery for trackpads, phones and mice. */
export default function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const targetRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [activePanel, setActivePanel] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.32 });
  const x = useTransform(smoothProgress, [0, .16, .39, .52, .75, 1], ['0%', '0%', '-33.333%', '-33.333%', '-66.666%', '-66.666%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value < .34 ? 0 : value < .68 ? 1 : 2;
    setActivePanel((current) => current === next ? current : next);
    if (value > .025) setHasEntered(true);
  });

  return <section ref={targetRef} className={`relative h-[400vh] md:cursor-none ${className}`} aria-label="Recorrido por la obra">
    <div className="sticky top-0 h-screen overflow-hidden">
      <LeatherGrain />
      <RitualCursor />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-px bg-white/10" />
      <motion.div className="absolute top-0 left-0 z-50 h-px bg-[#a51f2d]" style={{ width: progressWidth }} />
      <div className="pointer-events-none absolute top-7 left-6 z-30 flex items-center gap-3 md:top-10 md:left-12"><span className="text-[9px] tracking-[.34em] uppercase text-[#a51f2d]">{String(activePanel + 1).padStart(2, '0')}</span><span className="h-px w-8 bg-white/20" /><span className="text-[9px] tracking-[.25em] uppercase text-white/55">{panelNames[activePanel]}</span></div>
      <motion.div animate={{ opacity: hasEntered ? 0 : 1, y: hasEntered ? -8 : 0 }} transition={{ duration: .45 }} className="pointer-events-none absolute right-6 bottom-8 z-30 flex items-center gap-3 md:right-12 md:bottom-10"><span className="hidden text-[9px] tracking-[.24em] uppercase text-white/55 md:block">Desliza hacia abajo</span><span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-[#e5e5e5]">↓</span></motion.div>
      <motion.div style={{ x: reducedMotion ? 0 : x }} className="relative z-10 flex h-full w-[300vw] will-change-transform">{children}</motion.div>
    </div>
  </section>;
}
