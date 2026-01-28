export const partnerKeys = {
  all: ['partner'] as const,
  cuisines: () => [...partnerKeys.all, 'cuisines'] as const,
};
