import type { CreateUserRequest, UpdateUserRequest, User } from './types';
import apiClient from '@/lib/axios';

export const userService = {
  getAll: () => apiClient.get<User[]>('/users').then((res) => res.data),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`).then((res) => res.data),
  create: (data: CreateUserRequest) => apiClient.post<User>('/users', data).then((res) => res.data),
  update: (id: string, data: UpdateUserRequest) =>
    apiClient.put<User>(`/users/${id}`, data).then((res) => res.data),
};
