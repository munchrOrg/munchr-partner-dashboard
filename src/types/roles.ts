export type PagePermission = {
  page: string;
  view: boolean;
  edit: boolean;
  delete: boolean;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: PagePermission[];
};

// Available pages for permissions
export const AVAILABLE_PAGES = [
  'Dashboard',
  'Order History',
  'Performance',
  'Reviews',
  'Invoices',
  'Menu',
  'Reels',
] as const;

// Hardcoded role data - converted to new structure
export const ROLES: Role[] = [
  {
    id: '1',
    name: 'Editor',
    description: 'Full access to all features',
    permissions: [
      { page: 'Dashboard', view: true, edit: true, delete: false },
      { page: 'Reports', view: true, edit: true, delete: false },
      { page: 'Settings', view: true, edit: true, delete: false },
    ],
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access with user management',
    permissions: [
      { page: 'Dashboard', view: true, edit: true, delete: false },
      { page: 'Reports', view: true, edit: true, delete: false },
      { page: 'Settings', view: true, edit: true, delete: true },
      { page: 'User Management', view: true, edit: true, delete: true },
      { page: 'Roles & Access', view: true, edit: true, delete: false },
    ],
  },
  {
    id: '3',
    name: 'Super Admin',
    description: 'Complete system access and control',
    permissions: [
      { page: 'Dashboard', view: true, edit: true, delete: true },
      { page: 'Reports', view: true, edit: true, delete: true },
      { page: 'Settings', view: true, edit: true, delete: true },
      { page: 'User Management', view: true, edit: true, delete: true },
      { page: 'Roles & Access', view: true, edit: true, delete: true },
      { page: 'System Configuration', view: true, edit: true, delete: true },
      { page: 'Analytics', view: true, edit: true, delete: true },
    ],
  },
];
