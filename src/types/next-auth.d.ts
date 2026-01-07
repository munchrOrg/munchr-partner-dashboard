import 'next-auth';

declare module 'next-auth' {
  type User = {
    id: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
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

declare module 'next-auth/jwt' {
  type JWT = {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
}
