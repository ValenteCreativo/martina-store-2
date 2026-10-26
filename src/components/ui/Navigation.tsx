'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Only hide on the home page during the intro portal
      if (isHome) {
        setNavVisible(window.scrollY > window.innerHeight * 0.85);
      } else {
        setNavVisible(true);
      }
    };
    // On mount, set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const navItems = [
    { href: '/',             label: 'Inicio',      sub: 'Inicio' },
    { href: '/portfolio',    label: 'Portafolio',  sub: 'Obra' },
    { href: '/services',     label: 'Servicios',   sub: 'Sesiones' },
    { href: '/reservations', label: 'Reservas',    sub: 'Agenda' },
    { href: '/about',        label: 'Sobre mí',    sub: 'Martina' },
  ];

  return (
    <>
      {/* ── Top bar ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'py-4 mix-blend-difference' : 'py-8'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -20 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: navVisible ? 'auto' : 'none' }}
      >
        <div className="content-container relative flex items-center justify-between">
          <div className="hidden md:block w-12" />

          {/* Logo centered */}
          <Link
            href="/"
            className="group flex flex-col items-center absolute left-1/2 -translate-x-1/2"
            style={{
              opacity: scrolled ? 0 : 1,
              pointerEvents: scrolled ? 'none' : 'auto',
              transition: 'opacity 0.5s ease',
            }}
          >
            <span className="text-xl font-light tracking-[0.5em] uppercase text-white transition-all duration-500">
              Martina Gorozo
            </span>
            <span className="h-px w-full mt-2 bg-[#8a1c1c] group-hover:w-1/2 transition-all duration-700" />
          </Link>

          {/* Right — hamburger only (wallet moved to menu overlay) */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-3 text-white hover:text-[#8a1c1c] transition-colors"
              aria-label="Abrir menú"
            >
              <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Menú
              </span>
              <Menu size={22} strokeWidth={1} className="transition-transform duration-500 group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Full-screen overlay menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.15 } }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#050505' }}
          >
            {/* menu-burger.png as background at 40% opacity */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/menu-burger.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4,
                mixBlendMode: 'luminosity',
              }}
            />

            {/* Dark veil on top of image so text stays legible */}
            <div className="absolute inset-0 bg-[#050505]/60 pointer-events-none" />

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 md:top-10 md:right-12 text-white/40 hover:text-[#8a1c1c] transition-colors group z-10"
              aria-label="Cerrar menú"
            >
              <X size={28} strokeWidth={0.8} className="transition-transform duration-500 group-hover:rotate-90" />
              <span className="block text-[9px] tracking-widest uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Cerrar</span>
            </button>

            {/* Nav links */}
            <nav className="relative z-10 flex flex-col items-center gap-6 md:gap-7">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.55, delay: index * 0.07 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group relative flex flex-col items-center"
                  >
                    {/* Main label — toned-down size */}
                    <span className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#e5e5e5] group-hover:text-[#8a1c1c] transition-colors duration-400">
                      {item.label}
                    </span>
                    {/* Sub-label */}
                    <span className="text-[9px] text-[#9a9a9a] tracking-[0.5em] uppercase mt-0.5 group-hover:tracking-[0.9em] transition-all duration-500">
                      {item.sub}
                    </span>
                    {/* underline thread */}
                    <span className="absolute -bottom-2 left-1/2 w-0 h-px bg-[#8a1c1c] group-hover:w-full group-hover:left-0 transition-all duration-500" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <a href="mailto:martinagorozo@gmail.com" className="relative z-10 mt-10 text-[10px] tracking-[0.2em] text-[#c8bfba] hover:text-white transition-colors">
              martinagorozo@gmail.com
            </a>

            {/* Decorative vertical thread */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top' }}
              className="absolute left-10 top-0 h-full w-px bg-white/15 hidden md:block"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
