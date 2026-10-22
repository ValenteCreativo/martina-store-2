import 'server-only';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'martina_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
type Session = { userId: string; email: string; isAdmin: boolean };

function secret() { const value = process.env.ADMIN_SESSION_SECRET; if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET debe tener al menos 32 caracteres.'); return new TextEncoder().encode(value); }
export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export async function createSession(session: Session) { return new SignJWT({ email: session.email, isAdmin: session.isAdmin }).setProtectedHeader({ alg: 'HS256' }).setSubject(session.userId).setIssuedAt().setExpirationTime(`${SESSION_TTL_SECONDS}s`).sign(secret()); }
async function readSession(token?: string): Promise<Session | null> { if (!token) return null; try { const { payload } = await jwtVerify(token, secret()); if (!payload.sub || payload.isAdmin !== true || typeof payload.email !== 'string') return null; return { userId: payload.sub, email: payload.email, isAdmin: true }; } catch { return null; } }
export function setSession(response: NextResponse, token: string) { response.cookies.set(ADMIN_SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: SESSION_TTL_SECONDS }); }
export async function requireAdmin(request: NextRequest) { try { const session = await readSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value); return session ? session : { error: NextResponse.json({ error: 'No autorizado.' }, { status: 401 }) }; } catch { return { error: NextResponse.json({ error: 'La sesión no está configurada.' }, { status: 503 }) }; } }
export async function assertServerAdmin() { const session = await readSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value); if (!session) throw new Error('No autorizado.'); return session; }
