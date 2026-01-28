import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { useSignupStore } from '@/stores/signup-store';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - attach auth token from Zustand store
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status || error?.request?.status;

    const backendData = error?.response?.data;
    let backendMessage = backendData?.message;

    if (backendMessage && typeof backendMessage === 'object' && backendMessage.message) {
      backendMessage = backendMessage.message;
    }

    if (backendMessage && typeof backendMessage === 'string') {
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

export default apiClient;
