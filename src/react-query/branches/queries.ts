import { useQuery } from '@tanstack/react-query';
import { branchesKeys } from './keys';
import { branchesService } from './service';

export const useBranches = () =>
  useQuery({
    queryKey: branchesKeys.all,
    queryFn: branchesService.getAll,
  });

export const useBranchProfile = () =>
  useQuery({
    queryKey: [...branchesKeys.all, 'profile'],
    queryFn: branchesService.getBranchProfile,
  });

export const useBranchOnboardingProfile = useBranchProfile;
