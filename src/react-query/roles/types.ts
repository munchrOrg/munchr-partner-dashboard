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
