import type { RolePermissionsResponse } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesKeys } from './keys';
import { rolesService } from './service';

export function useGetPermissionsMutation() {
  return useMutation<RolePermissionsResponse, Error>({
    mutationFn: rolesService.getPermissions,
  });
}

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
};
