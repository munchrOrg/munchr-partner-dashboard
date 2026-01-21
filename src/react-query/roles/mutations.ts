import type { RolePermissionsResponse } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesKeys } from './keys';
import { rolesService } from './service';

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; description: string; permissionIds: string[] };
    }) => rolesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
};

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
