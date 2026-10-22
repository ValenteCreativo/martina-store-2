import { NextRequest, NextResponse } from 'next/server';
import { db, walletUsers } from '../../../../db';
import { eq } from 'drizzle-orm';
import { isAdminEmail } from '../../../../lib/crypto';

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'La autenticación con wallet está temporalmente desactivada.' }, { status: 410 });
  /*
  try {
    const { privyId, walletAddress, email } = await request.json();

    if (!privyId) {
      return NextResponse.json({ error: 'Privy ID is required' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(walletUsers)
      .where(eq(walletUsers.privyId, privyId));

    const isWhitelisted = isAdminEmail(email);

    if (existingUser) {
      // Update existing user
      const [updatedUser] = await db
        .update(walletUsers)
        .set({
          walletAddress: walletAddress || existingUser.walletAddress,
          email: email || existingUser.email,
          isWhitelisted,
          updatedAt: new Date(),
        })
        .where(eq(walletUsers.privyId, privyId))
        .returning();

      return NextResponse.json({
        user: updatedUser,
        isAdmin: isWhitelisted,
      });
    }

    // Create new user
    const [newUser] = await db
      .insert(walletUsers)
      .values({
        privyId,
        walletAddress,
        email,
        isWhitelisted,
      })
      .returning();

    return NextResponse.json({
      user: newUser,
      isAdmin: isWhitelisted,
    });
  } catch (error) {
    console.error('Wallet auth error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate wallet' },
      { status: 500 }
    );
  }
  */
}
