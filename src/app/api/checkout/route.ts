import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { db, mercadoPagoOrders, artworks } from '../../../db';
import { eq } from 'drizzle-orm';
import { limit } from '../../../lib/rate-limit';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const throttled = limit(req, 'checkout', 8, 60_000);
        if (throttled) return throttled;
        if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
            return NextResponse.json({ error: 'El pago con tarjeta aún no está configurado.' }, { status: 503 });
        }
        const body = await req.json();
        const { id } = body;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify artwork exists and is available
        const [artwork] = await db
            .select()
            .from(artworks)
            .where(eq(artworks.id, id));

        if (!artwork) {
            return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
        }

        if (!artwork.available) {
            return NextResponse.json({ error: 'Artwork is no longer available' }, { status: 400 });
        }

        const amount = Number(artwork.price);
        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: 'Esta obra no tiene un precio de venta válido.' }, { status: 400 });
        }

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id,
                        title: artwork.title,
                        unit_price: amount,
                        quantity: 1,
                        description: artwork.description || '',
                        picture_url: artwork.imageUrl || '',
                    },
                ],
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
                },
                auto_return: 'approved',
                external_reference: id,
                metadata: {
                    artwork_id: id,
                },
            },
        });

        // Register a pending MercadoPago order in our DB
        await db.insert(mercadoPagoOrders).values({
            artworkId: id,
            preferenceId: result.id || '',
            externalReference: id,
            amountUsd: amount.toString(),
            status: 'pending',
        }).onConflictDoNothing();

        return NextResponse.json({ id: result.id, url: result.init_point });
    } catch (error) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
    }
}
