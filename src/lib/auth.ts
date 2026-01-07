import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Login Provider
    Credentials({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Invalid credentials');
        }

        return {
          id: data.user.id,
          email: data.user.email,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),

    // Signup Provider
    Credentials({
      id: 'signup',
      name: 'Sign Up',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Return partial user - no tokens yet (needs OTP verification)
        // We store userId to use in OTP verification
        return {
          id: data.userId,
          email: credentials?.email as string,
          // No tokens - user needs to verify OTP first
          pendingVerification: true,
        };
      },
    }),

    // OTP Verification Provider
    Credentials({
      id: 'verify-otp',
      name: 'Verify OTP',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: credentials?.userId,
            otp: credentials?.otp,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'OTP verification failed');
        }

        return {
          id: data.user.id,
          email: data.user.email,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),

    // Resend OTP Provider (just triggers resend, doesn't create session)
    Credentials({
      id: 'resend-otp',
      name: 'Resend OTP',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/resend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: credentials?.userId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to resend OTP');
        }

        // Return null - we don't want to create a session, just resend OTP
        // The error will be caught and we handle it in the UI
        throw new Error('OTP_RESENT');
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  callbacks: {
    async signIn({ user }) {
      // Block session creation for pending verification users
      if ('pendingVerification' in user && user.pendingVerification) {
        // Store userId for OTP page - will be handled by the page
        return `/verify-otp?userId=${user.id}`;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? '';
        token.accessToken = user.accessToken ?? '';
        token.refreshToken = user.refreshToken ?? '';
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
