'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function RitualCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100); const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 280, damping: 26, mass: .28 });
  const ringY = useSpring(y, { stiffness: 280, damping: 26, mass: .28 });
  const [active, setActive] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const onMove = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); setActive(Boolean((event.target as Element).closest('a, button'))); };
    const onChange = () => setEnabled(media.matches); onChange(); media.addEventListener('change', onChange); window.addEventListener('pointermove', onMove);
    return () => { media.removeEventListener('change', onChange); window.removeEventListener('pointermove', onMove); };
  }, [x, y]);
  if (!enabled) return null;
  return <><motion.span aria-hidden="true" className="pointer-events-none fixed z-[70] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c64d58] mix-blend-screen" style={{ left: x, top: y }} /><motion.span aria-hidden="true" animate={{ width: active ? 46 : 28, height: active ? 46 : 28, borderColor: active ? 'rgba(198,77,88,.9)' : 'rgba(244,238,232,.42)' }} transition={{ duration: .18 }} className="pointer-events-none fixed z-[69] -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ left: ringX, top: ringY }} /></>;
}
