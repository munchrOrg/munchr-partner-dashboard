import { NextResponse } from 'next/server';

export function proxy() {
  return NextResponse.next();
}
// TODO: Uncomment this when the backend is ready and remove above implementation of proxy middleware

// import type { NextRequest } from 'next/server';

// const protectedRoutes = ['/dashboard'];
// const authRoutes = ['/sign-in', '/sign-up', '/verify-otp'];

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
//   const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

//   if (!isProtectedRoute && !isAuthRoute) {
//     return NextResponse.next();
//   }

//   const sessionToken =
//     request.cookies.get('next-auth.session-token')?.value ||
//     request.cookies.get('__Secure-next-auth.session-token')?.value;

//   if (isProtectedRoute && !sessionToken) {
//     const signInUrl = new URL('/sign-in', request.url);
//     signInUrl.searchParams.set('callbackUrl', pathname);
//     return NextResponse.redirect(signInUrl);
//   }

//   if (isAuthRoute && sessionToken) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/sign-in',
//     '/sign-up',
//     '/verify-otp',
//   ],
// };
