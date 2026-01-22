import type { Cuisine } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cuisinesKeys } from './keys';
import { cuisinesService } from './service';

export const useCreateCuisine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cuisine) => cuisinesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuisinesKeys.all });
    },
  });
};

export const useUpdateCuisine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cuisine) => cuisinesService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuisinesKeys.all });
    },
  });
};
