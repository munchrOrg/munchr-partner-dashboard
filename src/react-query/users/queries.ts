import { useQuery } from '@tanstack/react-query';
import { userKeys } from './keys';
import { userService } from './service';

export const useUsers = () =>
  useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getAll,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
