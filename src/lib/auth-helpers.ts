import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

/**
 * Get authentication headers for API requests
 * Checks localStorage, sessionStorage, and NextAuth session in that order
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      accessToken = sessionStorage.getItem('accessToken');
    }
    if (!accessToken) {
      const session = (await getSession()) as Session | null;
      accessToken = session?.accessToken || '';
    }
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return headers;
}
