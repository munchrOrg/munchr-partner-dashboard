import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    pendingVerification?: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
    } & DefaultSession['user'];
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    id: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    pendingVerification?: boolean;
  }
}
