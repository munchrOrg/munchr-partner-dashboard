import { useQuery } from '@tanstack/react-query';
import { authKeys } from './keys';
import { authService } from './service';

export const useProfile = () =>
  useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    staleTime: 60 * 1000,
  });
