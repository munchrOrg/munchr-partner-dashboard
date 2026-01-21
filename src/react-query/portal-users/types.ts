export type PortalUser = {
  id: string;
  name: string;
  email: string;
  // Add more fields as per API response
};

export type PortalUsersResponse = {
  data: PortalUser[];
};
