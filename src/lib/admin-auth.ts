import 'server-only';

import { PrivyClient } from '@privy-io/node';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function adminDids() {
  return new Set((process.env.ADMIN_PRIVY_DIDS || '').split(',').map((id) => id.trim()).filter(Boolean));
}

/** Server-side authorization for every operation that changes studio data.
 * A browser-provided email or localStorage value is never an authorization signal. */
async function verifyAdminToken(token: string | undefined) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  const allowedDids = adminDids();
  if (!appId || !appSecret || allowedDids.size === 0) {
    return { reason: 'La autorización del panel no está configurada.', status: 503 };
  }
  if (!token) return { reason: 'No autorizado.', status: 401 };

  try {
    const privy = new PrivyClient({ appId, appSecret });
    const claims = await privy.utils().auth().verifyAccessToken(token);
    if (!allowedDids.has(claims.user_id)) {
      return { reason: 'No autorizado.', status: 403 };
    }
    return { userId: claims.user_id };
  } catch {
    return { reason: 'Sesión inválida o expirada.', status: 401 };
  }
}

export async function requireAdmin(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const result = await verifyAdminToken(token);
  return 'reason' in result ? { error: NextResponse.json({ error: result.reason }, { status: result.status }) } : result;
}

/** For Next Server Actions: only Privy's HttpOnly cookie can authorize a mutation. */
export async function assertServerAdmin() {
  const store = await cookies();
  const result = await verifyAdminToken(store.get('privy-token')?.value);
  if ('reason' in result) throw new Error(result.reason);
  return result.userId;
}
