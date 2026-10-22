import { NextRequest, NextResponse } from 'next/server';

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Lightweight per-instance protection; production should additionally use edge/WAF limits. */
export function limit(request: NextRequest, scope: string, max: number, windowMs: number) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  bucket.count += 1;
  if (bucket.count > max) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((bucket.resetAt - now) / 1000)) } });
  }
  return null;
}
