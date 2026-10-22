import { NextRequest, NextResponse } from 'next/server';
import { db, reservations } from '../../../db';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '../../../lib/admin-auth';
import { limit } from '../../../lib/rate-limit';

// POST: Submit a new reservation request
export async function POST(request: NextRequest) {
    try {
        const throttled = limit(request, 'reservation', 5, 60 * 60_000);
        if (throttled) return throttled;
        const {
            name,
            email,
            phone,
            instagram,
            sessionType,
            description,
            placement,
            sizeApprox,
            referenceImageUrl,
            additionalNotes,
            preferredDate,
            preferredTime,
        } = await request.json();

        // Validate required fields
        if (!name || !email || !sessionType || !description || typeof name !== 'string' || typeof description !== 'string' || name.length > 120 || description.length > 5000) {
            return NextResponse.json(
                { error: 'Name, email, session type and description are required' },
                { status: 400 }
            );
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const [reservation] = await db
            .insert(reservations)
            .values({
                name,
                email,
                phone: phone || null,
                instagram: instagram || null,
                sessionType,
                description,
                placement: placement || null,
                sizeApprox: sizeApprox || null,
                referenceImageUrl: referenceImageUrl || null,
                additionalNotes: additionalNotes || null,
                preferredDate: preferredDate || null,
                preferredTime: preferredTime || null,
                status: 'pending',
            })
            .returning();

        return NextResponse.json({ success: true, reservationId: reservation.id }, { status: 201 });
    } catch (error) {
        console.error('Reservation error:', error);
        return NextResponse.json({ error: 'Failed to submit reservation' }, { status: 500 });
    }
}

// GET: Admin only — list all reservations
export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    try {
        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status');
        const limit = Math.min(Number(searchParams.get('limit') || 50), 200);

        const query = db
            .select()
            .from(reservations)
            .orderBy(desc(reservations.createdAt))
            .limit(limit);

        const results = statusFilter
            ? await db
                .select()
                .from(reservations)
                .where(eq(reservations.status, statusFilter))
                .orderBy(desc(reservations.createdAt))
                .limit(limit)
            : await query;

        return NextResponse.json({ reservations: results });
    } catch (error) {
        console.error('Get reservations error:', error);
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}
