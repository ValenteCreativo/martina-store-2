'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Suspense } from 'react';

function PendingContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference');

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center text-[#e5e5e5] pt-24">
            <div className="text-center p-8 max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full border border-[#8b7d7b]/40 flex items-center justify-center">
                        <Clock size={32} className="text-[#c8bfba]" />
                    </div>
                </div>

                <div className="w-px h-12 bg-white/30 mx-auto mb-8 opacity-50" />

                <h1 className="text-3xl font-light uppercase tracking-widest mb-4 text-[#e5e5e5]">
                    Pago en Proceso
                </h1>

                <p className="text-[#c8bfba] mb-4 font-light leading-relaxed">
                    Tu pago está siendo procesado por MercadoPago. Esto puede tomar unos minutos.
                </p>
                <p className="text-[#c8bfba] mb-8 font-light leading-relaxed text-sm">
                    Recibirás una confirmación por email una vez que sea aprobado. No es necesario que hagas nada más.
                </p>

                {externalReference && (
                    <div className="p-4 border border-[#1a1a1a] bg-[#0a0a0a] text-left mb-6">
                        <div className="text-[9px] uppercase tracking-widest text-[#9a9a9a] mb-2">
                            Referencia de orden
                        </div>
                        <span className="text-sm text-[#e5e5e5] font-mono">
                            {externalReference.slice(0, 8)}...
                        </span>
                    </div>
                )}

                {paymentId && (
                    <div className="p-4 border border-[#1a1a1a] bg-[#0a0a0a] text-left mb-6">
                        <div className="text-[9px] uppercase tracking-widest text-[#9a9a9a] mb-2">
                            ID de pago MercadoPago
                        </div>
                        <span className="text-sm text-[#e5e5e5] font-mono">
                            {paymentId}
                        </span>
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3">
                    <Link href="/portfolio" className="btn-ritual">
                        Seguir Explorando
                    </Link>
                    <Link href="/" className="text-xs text-[#606060] hover:text-[#e5e5e5] transition-colors">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function PendingPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse" />
            </main>
        }>
            <PendingContent />
        </Suspense>
    );
}
