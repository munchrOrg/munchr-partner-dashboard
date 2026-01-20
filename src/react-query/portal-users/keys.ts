export const portalUsersKeys = {
  all: ['portal-users'] as const,
  lists: () => [...portalUsersKeys.all, 'list'] as const,
  detail: (id: string) => [...portalUsersKeys.all, 'detail', id] as const,
};
