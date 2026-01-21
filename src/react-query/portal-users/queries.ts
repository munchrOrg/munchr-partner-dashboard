import { useQuery } from '@tanstack/react-query';
import { portalUsersService } from './service';

export const usePortalUsers = () =>
  useQuery({
    queryKey: ['portal-users'],
    queryFn: portalUsersService.getAll,
  });
