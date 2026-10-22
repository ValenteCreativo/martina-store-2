import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from './lib/admin-auth';
export function middleware(request: NextRequest) { const { pathname } = request.nextUrl; if (pathname === '/login' || pathname.startsWith('/api/auth/')) return NextResponse.next(); if (pathname.startsWith('/admin') && !request.cookies.get(ADMIN_SESSION_COOKIE)?.value) return NextResponse.redirect(new URL('/login', request.url)); return NextResponse.next(); }
export const config = { matcher: ['/admin/:path*'] };
