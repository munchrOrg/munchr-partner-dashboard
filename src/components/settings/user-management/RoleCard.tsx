'use client';

import type { Role } from '@/react-query/roles/types';
import { CheckCircle2, SquarePen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type RoleCardProps = {
  role: Role;
  onEdit: (role: Role, id: string) => void;
  selected?: boolean;
};

export function RoleCard({ role, onEdit, selected }: Readonly<RoleCardProps>) {
  const permissionNames = (role.permissions || []).map((p: any) => p.name || p.page || '');
  const visiblePermissions = permissionNames.slice(0, 2);
  const remainingCount = permissionNames.length - visiblePermissions.length;

  return (
    <Card
      className={`flex flex-col gap-4 rounded-lg border p-4 shadow-none ${selected ? 'border-2 border-yellow-400' : 'border-[#00000026] bg-[#F4F4F4]'}`}
    >
      <div className="relative flex flex-col gap-2">
        {selected && <CheckCircle2 className="absolute top-0 right-0 h-6 w-6 text-yellow-400" />}
        <h3 className="text-xl font-bold text-black">{role.name}</h3>
        <p className="text-sm text-[#918D8C]">{role.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="mb-2 text-sm text-[#918D8C]">Permissions ({permissionNames.length})</p>
        <div className="flex flex-wrap gap-2">
          {visiblePermissions.map((perm, idx) => (
            <Badge
              key={perm + idx}
              variant="outline"
              className="h-10 rounded-full border px-4 text-black"
            >
              {perm}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline" className="h-10 rounded-full bg-gray-100 px-4 text-black">
              +{remainingCount} More
            </Badge>
          )}
        </div>
      </div>

      <Button
        onClick={() => onEdit(role, role.id)}
        className="bg-gradient-yellow mt-auto w-full rounded-full text-black hover:opacity-90"
      >
        <SquarePen className="mr-2 h-4 w-4" />
        Edit Role
      </Button>
    </Card>
  );
}
