import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/onboarding', '/dashboard'];

const authOnlyRoutes = ['/sign-in', '/sign-up'];

const verificationRoutes = ['/verify-email', '/verify-phone'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/monitoring') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!authToken;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthOnlyRoute = authOnlyRoutes.some((route) => pathname.startsWith(route));
  const isVerificationRoute = verificationRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/onboarding/welcome', request.url));
  }

  if (isVerificationRoute) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/onboarding/welcome', request.url));
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
