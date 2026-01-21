import { useQuery } from '@tanstack/react-query';
import { cuisinesKeys } from './keys';
import { cuisinesService } from './service';

export const useCuisines = () =>
  useQuery({
    queryKey: cuisinesKeys.all,
    queryFn: cuisinesService.getAll,
  });

export const useCuisineById = (id: string) =>
  useQuery({
    queryKey: cuisinesKeys.detail(id),
    queryFn: () => cuisinesService.getById(id),
    enabled: !!id, // API call tabhi chale jab id ho
  });
