export const cuisinesKeys = {
  all: ['cuisines'] as const,
  list: () => [...cuisinesKeys.all, 'list'] as const,
  detail: (id: string) => [...cuisinesKeys.all, 'detail', id] as const,
};
