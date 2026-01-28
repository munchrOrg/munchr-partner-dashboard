import type { Role } from '@/react-query/roles/types';

export type UserStatus = 'invited' | 'active' | 'inactive' | 'suspended';

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  roles: Role[];
  createdAt?: string;
};

export type CreatePortalUserRequest = {
  name: string;
  email: string;
  password: string;
  roleIds: string[];
};

export type UpdatePortalUserRequest = {
  name?: string;
  roleIds?: string[];
  status?: UserStatus;
};
