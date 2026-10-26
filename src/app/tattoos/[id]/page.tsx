'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { artworkService } from '../../../lib/services';
import ImageMagnifier from '../../../components/ui/ImageMagnifier';
import type { Artwork } from '../../../types';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function TattooDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;

        const loadArtwork = async (id: string) => {
            try {
                const { data } = await artworkService.getById(id);
                if (data) {
                    setArtwork(data);
                } else {
                    router.push('/tattoos');
                }
            } catch (error) {
                console.error('Error loading tattoo:', error);
            } finally {
                setLoading(false);
            }
        };

        loadArtwork(params.id as string);
    }, [params.id, router]);

    async function handleBuy() {
        if (!artwork) return;
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: artwork.id,
                    title: artwork.title,
                    price: artwork.price,
                    description: artwork.description,
                    picture_url: artwork.imageUrl
                })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('No se pudo iniciar el pago.');
            }
        } catch (error) {
            console.error('Error initiating checkout:', error);
            alert('No se pudo iniciar el pago. Intenta de nuevo.');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
            </div>
        );
    }

    if (!artwork) return null;

    return (
        <main className="min-h-screen bg-[#050505] text-[#e5e5e5] pt-32 pb-24">
            <div className="content-container max-w-6xl">

                {/* Back Navigation */}
                <Link href="/tattoos" className="inline-flex items-center gap-2 text-[#c8bfba] hover:text-[#8a1c1c] transition-colors mb-12 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] uppercase tracking-[0.2em]">Volver a tatuajes</span>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">

                    {/* Left: The Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-full relative"
                    >
                        <div className="aspect-[3/4] md:aspect-[4/5] relative bg-[#0a0a0a] border-[1px] border-[#1a1a1a] shadow-2xl z-[60]">
                            {artwork.imageUrl ? (
                                <ImageMagnifier
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    className="object-cover z-[60]"
                                />
                            ) : <div className="w-full h-full bg-[#0a0a0a]" />}
                        </div>
                    </motion.div>


                    {/* Right: The Detail Label */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex flex-col space-y-8 pt-8 md:pt-16"
                    >
                        {/* Header Info */}
                        <div className="space-y-3 border-l-2 border-[#8a1c1c] pl-6">
                            <h1 className="text-3xl md:text-5xl font-light tracking-wide text-[#e5e5e5] uppercase">{artwork.title}</h1>
                            <p className="text-[#c8bfba] text-xs tracking-[0.3em] uppercase">Martina Gorozo • {artwork.year || new Date().getFullYear()}</p>
                        </div>

                        {/* Technical Specs */}
                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-[#1a1a1a]">
                            <div>
                                <span className="block text-[9px] uppercase tracking-widest text-[#9a9a9a] mb-1">Technique/Medium</span>
                                <span className="text-sm font-light text-[#e5e5e5]">
                                    {artwork.technique || artwork.medium || 'Handpoke / Machine'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[9px] uppercase tracking-widest text-[#9a9a9a] mb-1">Placement/Size</span>
                                <span className="text-sm font-light text-[#e5e5e5]">{artwork.dimensions || 'Custom'}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-invert">
                            <p className="text-[#c8bfba] font-light leading-relaxed text-sm">
                                {artwork.description || "A permanent mark, a ritual of ink and skin."}
                            </p>
                        </div>

                        {/* Acquisition/Booking */}
                        <div className="pt-8 mt-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[9px] uppercase tracking-widest text-[#9a9a9a]">Deposit / Price</span>
                                    <span className="text-2xl font-light text-[#8a1c1c]">${artwork.price || 50} USD</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[9px] uppercase tracking-widest ${artwork.available ? 'text-green-900/60' : 'text-red-900/60'}`}>
                                        {artwork.available ? 'Disponible' : 'Reservado'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleBuy}
                                disabled={!artwork.available}
                                className="w-full btn-ritual flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs py-4"
                            >
                                <ShoppingBag size={14} />
                                <span>{artwork.available ? 'Adquirir' : 'No disponible'}</span>
                            </button>
                        </div>

                    </motion.div>

                </div>
            </div>
        </main>
    );
}
