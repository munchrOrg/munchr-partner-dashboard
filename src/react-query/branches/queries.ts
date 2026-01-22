import { useQuery } from '@tanstack/react-query';
import { branchesKeys } from './keys';
import { branchesService } from './service';

export const useBranches = () =>
  useQuery({
    queryKey: branchesKeys.all,
    queryFn: branchesService.getAll,
  });

export const useBranchOnboardingProfile = () =>
  useQuery({
    queryKey: [...branchesKeys.all, 'onboarding-profile'],
    queryFn: branchesService.getOnboardingProfile,
  });
