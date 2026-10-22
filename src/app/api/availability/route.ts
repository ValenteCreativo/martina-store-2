import { NextRequest, NextResponse } from 'next/server';
import { db, availabilitySlots } from '../../../db';
import { asc, eq } from 'drizzle-orm';
import { requireAdmin } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error;
  const slots = await db.select().from(availabilitySlots).orderBy(asc(availabilitySlots.startsAt));
  return NextResponse.json({ slots });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error;
  try {
    const { startsAt, endsAt, note } = await request.json();
    const start = new Date(startsAt); const end = new Date(endsAt);
    if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end <= start) {
      return NextResponse.json({ error: 'El rango de disponibilidad no es válido.' }, { status: 400 });
    }
    const [slot] = await db.insert(availabilitySlots).values({ startsAt: start, endsAt: end, note: note || null }).returning();
    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    console.error('Availability creation error:', error);
    return NextResponse.json({ error: 'No se pudo guardar la disponibilidad.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Falta el bloque de disponibilidad.' }, { status: 400 });
  await db.delete(availabilitySlots).where(eq(availabilitySlots.id, id));
  return NextResponse.json({ success: true });
}
