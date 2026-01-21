import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portalUsersKeys } from './keys';
import { portalUsersService } from './service';

export const useUpdatePortalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      roleIds,
      status,
    }: {
      id: string;
      name: string;
      roleIds: string[];
      status: string;
    }) => portalUsersService.update(id, { name, roleIds, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalUsersKeys.all });
    },
  });
};

export const useDeletePortalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: portalUsersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalUsersKeys.all });
    },
  });
};
