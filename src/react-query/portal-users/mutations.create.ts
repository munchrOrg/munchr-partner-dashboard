import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portalUsersKeys } from './keys';
import { portalUsersService } from './service.create';

export const useCreatePortalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: portalUsersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalUsersKeys.all });
    },
  });
};
