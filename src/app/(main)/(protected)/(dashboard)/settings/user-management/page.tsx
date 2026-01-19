'use client';

import type { Role } from '@/types/roles';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { RoleCard } from '@/components/settings/user-management/RoleCard';
import { RoleFormDrawer } from '@/components/settings/user-management/RoleFormDrawer';
import { UserFormDrawer } from '@/components/settings/user-management/UserFormDrawer';
import { UserManagementTable } from '@/components/settings/user-management/UserManagementTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLES } from '@/types/roles';

export default function UserManagementPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRoleDrawerOpen, setIsRoleDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState('user-management');

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDrawerOpen(true);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsRoleDrawerOpen(true);
  };

  const handleCloseRoleDrawer = (open: boolean) => {
    setIsRoleDrawerOpen(open);
    if (!open) {
      setSelectedRole(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="rounded-full border border-gray-200 bg-transparent p-0">
            <TabsTrigger
              className="data-[state=active]:bg-purple-dark h-10 w-[240px] rounded-full data-[state=active]:text-white"
              value="user-management"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-purple-dark h-10 w-[240px] rounded-full data-[state=active]:text-white"
              value="roles-access"
            >
              Roles & Access
            </TabsTrigger>
          </TabsList>

          {activeTab === 'user-management' ? (
            <Button
              className="h-10 w-[180px] rounded-full border bg-white text-sm font-medium text-black"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add New User
            </Button>
          ) : (
            <Button
              className="h-10 w-[180px] rounded-full border bg-white text-sm font-medium text-black"
              onClick={handleCreateRole}
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Role
            </Button>
          )}
        </div>

        <TabsContent value="user-management" className="mt-6">
          <UserManagementTable />
        </TabsContent>

        <TabsContent value="roles-access" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role) => (
              <RoleCard key={role.id} role={role} onEdit={handleEditRole} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <UserFormDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <RoleFormDrawer
        open={isRoleDrawerOpen}
        onOpenChange={handleCloseRoleDrawer}
        role={selectedRole}
      />
    </div>
  );
}
