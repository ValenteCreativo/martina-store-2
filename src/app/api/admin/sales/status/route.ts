import { NextRequest, NextResponse } from 'next/server';
import { db, cryptoOrders } from '../../../../../db';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '../../../../../lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const [updated] = await db
      .update(cryptoOrders)
      .set({ status, updatedAt: new Date() })
      .where(eq(cryptoOrders.id, orderId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
