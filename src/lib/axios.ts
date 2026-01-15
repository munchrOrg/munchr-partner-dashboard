import type { Session } from 'next-auth';
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSignupStore } from '@/stores/signup-store';

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
        console.log('Sending Authorization header:', config.headers.Authorization);
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
    const status = error?.response?.status || error?.request?.status;
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        try {
          const onboardingStore = useOnboardingStore.getState();
          const signupStore = useSignupStore.getState();
          onboardingStore.reset();
          signupStore.reset();
        } catch {}
        if (window.location.pathname !== '/sign-in') {
          try {
            await signOut({ redirect: false });
          } catch {}
          window.location.href = '/sign-in';
        }
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
