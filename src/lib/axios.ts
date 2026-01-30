import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { useSignupStore } from '@/stores/signup-store';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || BACKEND_URL;
const PARTNER_URL = process.env.NEXT_PUBLIC_PARTNER_URL || BACKEND_URL;
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || BACKEND_URL;
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || BACKEND_URL;
const NOTIFICATION_URL = process.env.NEXT_PUBLIC_NOTIFICATION_URL || BACKEND_URL;

const attachInterceptors = (client: any) => {
  client.interceptors.request.use(
    (config: any) => {
      const { accessToken } = useAuthStore.getState();

      if (!config.headers) {
        config.headers = {};
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error: any) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const status = error?.response?.status || error?.request?.status;

      let backendMessage = error?.response?.data?.message;

      if (backendMessage && typeof backendMessage === 'object') {
        backendMessage = backendMessage.message;
      }

      if (typeof backendMessage === 'string') {
        error.message = backendMessage;
      }

      const isAuthRoute =
        typeof window !== 'undefined' &&
        (window.location.pathname === '/sign-in' ||
          window.location.pathname === '/sign-up' ||
          window.location.pathname.startsWith('/verify-'));

      if (status === 401 && typeof window !== 'undefined' && !isAuthRoute) {
        useAuthStore.getState().clearAuth();
        useOnboardingProfileStore.getState().reset();
        useSignupStore.getState().reset();
        window.location.href = '/sign-in';
      }

      return Promise.reject(error);
    }
  );
};

const createClient = (baseURL?: string) => {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  attachInterceptors(client);

  return client;
};

export const apiClient = createClient(BACKEND_URL);
export const authClient = createClient(AUTH_URL);
export const partnerClient = createClient(PARTNER_URL);
export const adminClient = createClient(ADMIN_URL);
export const mediaClient = createClient(MEDIA_URL);
export const notificationClient = createClient(NOTIFICATION_URL);
