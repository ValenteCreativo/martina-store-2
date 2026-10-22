import { NextRequest, NextResponse } from 'next/server';
import { db, cryptoOrders, walletUsers, artworks } from '../../../db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Los pagos con cripto están temporalmente desactivados.' }, { status: 410 });
  /*
  try {
    const { artworkId, chainId, tokenAddress, amountUsd, buyerAddress } = await request.json();

    // Validate required fields
    if (!artworkId || !chainId || !tokenAddress || !amountUsd) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify artwork exists and is available
    const [artwork] = await db
      .select()
      .from(artworks)
      .where(eq(artworks.id, artworkId));

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    if (!artwork.available) {
      return NextResponse.json(
        { error: 'Artwork is no longer available' },
        { status: 400 }
      );
    }

    // Find or create wallet user
    let buyer = null;
    if (buyerAddress) {
      const [existingUser] = await db
        .select()
        .from(walletUsers)
        .where(eq(walletUsers.walletAddress, buyerAddress));

      buyer = existingUser;
    }

    // Create crypto order
    const [order] = await db
      .insert(cryptoOrders)
      .values({
        artworkId,
        buyerId: buyer?.id || null,
        chainId,
        tokenAddress,
        amount: amountUsd.toString(), // Stablecoins 1:1 with USD
        amountUsd: amountUsd.toString(),
        status: 'pending',
      })
      .returning();

    return NextResponse.json({
      orderId: order.id,
      artworkId: artwork.id,
      amount: amountUsd,
      chainId,
      tokenAddress,
      recipientAddress: process.env.NEXT_PUBLIC_MARTINA_WALLET,
      status: 'pending',
    });
  } catch (error) {
    console.error('Crypto checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create crypto order' },
      { status: 500 }
    );
  }
  */
}
