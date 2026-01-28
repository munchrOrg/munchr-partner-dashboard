export const SystemRoleCode = {
  OWNER: 'owner',
  BRANCH_MANAGER: 'branch_manager',
  BRANCH_USER: 'branch_user',
  STAFF: 'staff',
  ACCOUNTANT: 'accountant',
} as const;

export type SystemRoleCodeType = (typeof SystemRoleCode)[keyof typeof SystemRoleCode];

export const SystemRoleName = {
  OWNER: 'Owner',
  BRANCH_MANAGER: 'Branch Manager',
  BRANCH_USER: 'Branch User',
  STAFF: 'Staff',
  ACCOUNTANT: 'Accountant',
} as const;

export function hasRoleByCode(
  roles: { code: string | null }[] | undefined | null,
  roleCode: SystemRoleCodeType
): boolean {
  if (!roles || roles.length === 0) {
    return false;
  }
  return roles.some((role) => role.code === roleCode);
}

export function hasRoleByName(
  roles: { name?: string }[] | undefined | null,
  roleName: string
): boolean {
  if (!roles || roles.length === 0) {
    return false;
  }
  return roles.some((role) => role.name === roleName);
}

export function getUserType(
  roles: { code: string | null; name?: string }[] | undefined | null
): 'owner' | 'branch_manager' | 'branch_user' | 'unknown' {
  if (hasRoleByCode(roles, SystemRoleCode.OWNER)) {
    return 'owner';
  }
  if (hasRoleByCode(roles, SystemRoleCode.BRANCH_MANAGER)) {
    return 'branch_manager';
  }
  if (hasRoleByCode(roles, SystemRoleCode.BRANCH_USER)) {
    return 'branch_user';
  }

  if (hasRoleByName(roles, SystemRoleName.OWNER)) {
    return 'owner';
  }
  if (hasRoleByName(roles, SystemRoleName.BRANCH_MANAGER)) {
    return 'branch_manager';
  }
  if (hasRoleByName(roles, SystemRoleName.BRANCH_USER)) {
    return 'branch_user';
  }

  return 'unknown';
}
