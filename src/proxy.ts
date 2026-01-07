import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard'];

// Auth routes (redirect to dashboard if already logged in)
const authRoutes = ['/sign-in', '/sign-up', '/verify-otp'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-relevant routes early
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Get session token from cookies (NextAuth uses this cookie name)
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Redirect to sign-in if accessing protected route without session
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to dashboard if accessing auth routes with active session
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match routes that need auth checking
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/verify-otp',
  ],
};
