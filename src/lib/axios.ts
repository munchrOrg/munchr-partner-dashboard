import type { Session } from 'next-auth';
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const session = (await getSession()) as Session | null;
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 - token expired or unauthorized
    const status = error?.response?.status || error?.request?.status;
    if (status === 401) {
      // avoid redirect loop if already on sign-in page
      if (typeof window !== 'undefined' && window.location.pathname !== '/sign-in') {
        try {
          // attempt to sign out client session (clears cookies/local state)
          // use redirect: false because we will handle navigation here

          await signOut({ redirect: false });
        } catch {
          // ignore
        }
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
