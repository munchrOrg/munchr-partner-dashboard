import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portalUsersKeys } from './keys';
import { portalUsersService } from './service';

export const useDeletePortalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: portalUsersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalUsersKeys.all });
    },
  });
};
