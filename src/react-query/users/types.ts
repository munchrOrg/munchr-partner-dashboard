export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: 'approved' | 'pending';
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type UpdateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: string;
};
