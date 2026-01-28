export type RolePermission = {
  id: string;
  name: string;
  code: string;
  resource: string;
  description: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissionIds?: string[];
  permissions?: RolePermission[];
};
