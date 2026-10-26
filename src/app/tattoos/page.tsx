'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { artworkService } from '../../lib/services';
import type { Artwork } from '../../types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TattoosPage() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArtworks();
    }, []);

    async function loadArtworks() {
        try {
            const { data, error } = await artworkService.getAll();
            if (error) throw error;
            // Filter for Tattoos only
            const tattoosOnly = data ? data.filter(a => a.category.toLowerCase().includes('tattoo')) : [];
            setArtworks(tattoosOnly);
        } catch (error) {
            console.error('Error loading tattoos:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen pt-32 pb-16 bg-[#050505] text-[#e5e5e5]">
            <div className="content-container max-w-7xl">

                {/* Navigation Back */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#c8bfba] hover:text-[#8a1c1c] transition-colors uppercase tracking-widest text-xs">
                        <ArrowLeft size={14} />
                        <span>Volver al inicio</span>
                    </Link>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                    <div className="mb-24 text-center">
                        <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-[0.2em] uppercase text-white">Tatuajes</h1>
                        <p className="text-[#c8bfba] tracking-[0.2em] uppercase text-xs mt-4">Línea fina · Microrrealismo</p>
                        <div className="w-px h-12 bg-white/30 mx-auto mt-8 opacity-50" />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
                        </div>
                    ) : artworks.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#9a9a9a] font-light italic">Aún no hay tatuajes publicados.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 w-full">
                            {artworks.map((artwork, index) => (
                                <motion.div
                                    key={artwork.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className={`group relative ${index % 2 !== 0 ? 'lg:translate-y-24' : ''} ${index % 3 === 2 ? 'lg:translate-y-12' : ''}`}
                                >
                                    <Link href={`/tattoos/${artwork.id}`} className="block">
                                        {/* Image Container */}
                                        <div className="relative mb-6 overflow-hidden border border-[#1a1a1a] group-hover:border-[#8a1c1c]/30 transition-colors duration-500 z-[60]">
                                            <div className="aspect-[3/4] relative bg-[#0a0a0a]">
                                                {artwork.imageUrl ? (
                                                    <Image
                                                        src={artwork.imageUrl}
                                                        alt={artwork.title}
                                                        fill
                                                        className="object-cover transition-all duration-[1.5s] grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                ) : <div className="w-full h-full bg-[#111]" />}
                                            </div>
                                        </div>

                                        {/* Minimal Metadata */}
                                        <div className="flex flex-col items-center space-y-2">
                                            <h3 className="text-lg font-light tracking-[0.2em] text-[#e5e5e5] uppercase group-hover:text-[#8a1c1c] transition-colors duration-500 text-center">{artwork.title}</h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
