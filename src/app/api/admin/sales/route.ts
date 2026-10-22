import { NextRequest, NextResponse } from 'next/server';
import { db, cryptoOrders, mercadoPagoOrders, artworks, walletUsers, shippingAddresses } from '../../../../db';
import { desc, eq } from 'drizzle-orm';
import { summarizeOrders } from '../../../../lib/admin';
import { requireAdmin } from '../../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const limit = Math.min(Number(searchParams.get('limit') || 50), 200);

    // --- Crypto orders ---
    const cryptoBaseQuery = db
      .select({
        id: cryptoOrders.id,
        status: cryptoOrders.status,
        amountUsd: cryptoOrders.amountUsd,
        tokenAddress: cryptoOrders.tokenAddress,
        chainId: cryptoOrders.chainId,
        txHash: cryptoOrders.txHash,
        createdAt: cryptoOrders.createdAt,
        artworkTitle: artworks.title,
        buyerEmail: walletUsers.email,
        walletAddress: walletUsers.walletAddress,
        shippingCity: shippingAddresses.city,
        shippingCountry: shippingAddresses.country,
        shippingAddress: shippingAddresses.address,
        shippingName: shippingAddresses.fullName,
        shippingPhone: shippingAddresses.phone,
      })
      .from(cryptoOrders)
      .leftJoin(artworks, eq(artworks.id, cryptoOrders.artworkId))
      .leftJoin(walletUsers, eq(walletUsers.id, cryptoOrders.buyerId))
      .leftJoin(shippingAddresses, eq(shippingAddresses.id, cryptoOrders.shippingAddressId));

    const cryptoResults = statusFilter
      ? await cryptoBaseQuery
          .where(eq(cryptoOrders.status, statusFilter))
          .orderBy(desc(cryptoOrders.createdAt))
          .limit(limit)
      : await cryptoBaseQuery
          .orderBy(desc(cryptoOrders.createdAt))
          .limit(limit);

    // --- MercadoPago orders ---
    const mpBaseQuery = db
      .select({
        id: mercadoPagoOrders.id,
        status: mercadoPagoOrders.status,
        amountUsd: mercadoPagoOrders.amountUsd,
        paymentId: mercadoPagoOrders.paymentId,
        createdAt: mercadoPagoOrders.createdAt,
        artworkTitle: artworks.title,
        buyerEmail: mercadoPagoOrders.buyerEmail,
        buyerName: mercadoPagoOrders.buyerName,
      })
      .from(mercadoPagoOrders)
      .leftJoin(artworks, eq(artworks.id, mercadoPagoOrders.artworkId));

    const mpResults = statusFilter
      ? await mpBaseQuery
          .where(eq(mercadoPagoOrders.status, statusFilter))
          .orderBy(desc(mercadoPagoOrders.createdAt))
          .limit(limit)
      : await mpBaseQuery
          .orderBy(desc(mercadoPagoOrders.createdAt))
          .limit(limit);

    // Normalize crypto orders
    const normalizedCrypto = cryptoResults.map((o) => ({
      id: o.id,
      paymentType: 'crypto' as const,
      status: o.status || 'pending',
      amountUsd: Number(o.amountUsd),
      tokenAddress: o.tokenAddress,
      chainId: o.chainId,
      txHash: o.txHash || null,
      createdAt: o.createdAt?.toISOString() || '',
      artworkTitle: o.artworkTitle || null,
      buyerEmail: o.buyerEmail || null,
      walletAddress: o.walletAddress || null,
      shippingCity: o.shippingCity || null,
      shippingCountry: o.shippingCountry || null,
      shippingAddress: o.shippingAddress || null,
      shippingName: o.shippingName || null,
      shippingPhone: o.shippingPhone || null,
    }));

    // Normalize MP orders
    const normalizedMp = mpResults.map((o) => ({
      id: o.id,
      paymentType: 'mercadopago' as const,
      status: o.status || 'pending',
      amountUsd: Number(o.amountUsd) || 0,
      tokenAddress: 'MercadoPago',
      chainId: 0,
      txHash: o.paymentId || null,
      createdAt: o.createdAt?.toISOString() || '',
      artworkTitle: o.artworkTitle || null,
      buyerEmail: o.buyerEmail || null,
      walletAddress: null,
      shippingCity: null,
      shippingCountry: null,
      shippingAddress: null,
      shippingName: o.buyerName || null,
      shippingPhone: null,
    }));

    // Merge and sort by date descending
    const allOrders = [...normalizedCrypto, ...normalizedMp].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Map 'approved' (MP status) to 'paid' for the summarizer
    const ordersForSummary = allOrders.map((o) => ({
      ...o,
      status: o.status === 'approved' ? 'paid' : o.status,
    }));

    const summary = summarizeOrders(ordersForSummary);

    return NextResponse.json({ summary, orders: allOrders });
  } catch (error) {
    console.error('Sales dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load sales' }, { status: 500 });
  }
}
