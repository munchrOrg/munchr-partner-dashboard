import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard'];

// Auth routes (redirect to dashboard if already logged in)
const authRoutes = ['/sign-in', '/sign-up', '/verify-otp'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get locale from pathname (e.g., /en/dashboard -> en)
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const locale = pathnameSegments[0];
  const pathWithoutLocale = `/${pathnameSegments.slice(1).join('/')}`;

  // Check if path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route));

  // Check if path is auth route
  const isAuthRoute = authRoutes.some((route) => pathWithoutLocale.startsWith(route));

  // Get session token from cookies (NextAuth uses this cookie name)
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Redirect to sign-in if accessing protected route without session
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to dashboard if accessing auth routes with active session
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
