import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/onboarding', '/dashboard'];

// Routes that should redirect to onboarding if already authenticated
const authRoutes = ['/sign-in', '/sign-up', '/verify-email', '/verify-phone'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for static files, API routes, and monitoring
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/monitoring') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie (HTTP-only cookie set by backend)
  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!authToken;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Protected routes: redirect to sign-in if no auth cookie
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Auth routes: redirect to onboarding if already authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/onboarding/welcome', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
