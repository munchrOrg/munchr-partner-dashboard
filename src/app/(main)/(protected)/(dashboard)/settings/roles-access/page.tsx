'use client';

import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RolesAccessPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="roles-access" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="h-10 gap-1 bg-transparent p-0">
            <TabsTrigger
              value="user-management"
              onClick={() => router.push('/settings/user-management')}
              className="data-[state=active]:bg-purple-dark rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-900 data-[state=active]:text-white data-[state=inactive]:hover:bg-gray-50"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="roles-access"
              onClick={() => router.push('/settings/roles-access')}
              className="bg-purple-dark rounded-md border border-gray-200 px-4 py-2 text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900 data-[state=inactive]:hover:bg-gray-50"
            >
              Roles & Access
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="user-management" className="mt-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">User Management</h2>
            <p className="text-gray-500">Manage your team and what they have access to.</p>
          </div>
        </TabsContent>

        <TabsContent value="roles-access" className="mt-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Roles & Access</h2>
            <p className="text-gray-500">
              Here you can manage roles, permissions, and access levels.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
