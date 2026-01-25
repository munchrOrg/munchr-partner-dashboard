import type { UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ProfileResponse } from './types';
import type { ApiErrorResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { authKeys } from './keys';
import { authService } from './service';

type QueryOptions<TData> = Omit<
  UseQueryOptions<TData, AxiosError<ApiErrorResponse>, TData>,
  'queryKey' | 'queryFn'
>;

export const useProfile = (options?: QueryOptions<ProfileResponse>) =>
  useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
