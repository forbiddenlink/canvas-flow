import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
      subscriptionTier?: string;
    } & DefaultSession['user'];
    error?: 'RefreshTokenError';
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string;
    isActive?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    isActive?: boolean;
    error?: 'RefreshTokenError';
  }
}
