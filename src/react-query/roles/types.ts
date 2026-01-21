export type RoleCreateResponse = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    description: string;
    permissionIds: string[];
  };
};
export type RolePermission = {
  id: string;
  name: string;
  code: string;
  resource: string;
  description: string;
};

export type RolePermissionsResponse = {
  data: RolePermission[];
};
