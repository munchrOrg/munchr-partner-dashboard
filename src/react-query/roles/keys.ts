export const rolesKeys = {
  all: ['roles'] as const,
  permissions: () => [...rolesKeys.all, 'permissions'] as const,
};
