import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}v1/auth/login`, {
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
    Credentials({
      id: 'signup',
      name: 'Sign Up',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}v1/auth/register`, {
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

        return {
          id: data.userId,
          email: credentials?.email as string,
          pendingVerification: true,
        };
      },
    }),
    Credentials({
      id: 'verify-otp',
      name: 'Verify OTP',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}v1/auth/otp/verify`, {
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
    Credentials({
      id: 'resend-otp',
      name: 'Resend OTP',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/otp/resend`, {
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
      if ('pendingVerification' in user && user.pendingVerification) {
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
