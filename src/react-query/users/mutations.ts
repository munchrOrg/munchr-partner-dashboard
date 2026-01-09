import type { CreateUserRequest } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from './keys';
import { userService } from './service';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
