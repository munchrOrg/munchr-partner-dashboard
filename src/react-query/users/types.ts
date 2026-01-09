export type User = {
  id: string;
  email: string;
  name?: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
};
