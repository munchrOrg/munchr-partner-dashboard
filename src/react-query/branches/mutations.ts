import type { Branch, BranchProfileUpdateRequest } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesKeys } from './keys';
import { branchesService } from './service';

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Branch) => branchesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
};

export const useUpdateBranchProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BranchProfileUpdateRequest) => branchesService.updateBranchProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
};

export const useUpdateBranch = useUpdateBranchProfile;
