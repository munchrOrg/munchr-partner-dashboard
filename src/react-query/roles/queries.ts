import { useQuery } from '@tanstack/react-query';
import { rolesKeys } from './keys';
import { rolesService } from './service';

export function useRolePermissions() {
  return useQuery({
    queryKey: rolesKeys.permissions(),
    queryFn: rolesService.getPermissions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
export const useAllRoles = () =>
  useQuery({
    queryKey: ['roles-all'],
    queryFn: rolesService.getAll,
  });
