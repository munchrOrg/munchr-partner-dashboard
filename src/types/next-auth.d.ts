import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type User = {
    id: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    pendingVerification?: boolean;
  };

  type Session = {
    user: {
      id: string;
      email: string;
    } & DefaultSession['user'];
    accessToken: string;
    refreshToken: string;
  } & DefaultSession;
}

declare module 'next-auth/jwt' {
  type JWT = {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
}

declare module '@auth/core/types' {
  type User = {
    id: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    pendingVerification?: boolean;
  };

  type Session = {
    user: {
      id: string;
      email: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}
