import { useQuery } from '@tanstack/react-query';
import { rolesService } from './service.all';

export const useAllRoles = () =>
  useQuery({
    queryKey: ['roles-all'],
    queryFn: rolesService.getAll,
  });
