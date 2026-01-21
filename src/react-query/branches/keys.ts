export const branchesKeys = {
  all: ['branches'] as const,
  lists: () => [...branchesKeys.all, 'list'] as const,
  detail: (id: string) => [...branchesKeys.all, 'detail', id] as const,
};
