import type { CreatePortalUserRequest, UpdatePortalUserRequest } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portalUsersKeys } from './keys';
import { portalUsersService } from './service';

export const useCreatePortalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePortalUserRequest) => portalUsersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalUsersKeys.all });
    },
  });
};

export const useUpdatePortalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePortalUserRequest }) =>
      portalUsersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalUsersKeys.all });
    },
  });
};

export const useDeletePortalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => portalUsersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalUsersKeys.all });
    },
  });
};
