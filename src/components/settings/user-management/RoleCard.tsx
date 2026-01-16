'use client';

import type { Role } from '@/types/roles';
import { SquarePen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type RoleCardProps = {
  role: Role;
  onEdit: (role: Role) => void;
};

export function RoleCard({ role, onEdit }: Readonly<RoleCardProps>) {
  // Get pages that have at least one permission enabled
  const pagesWithPermissions = role.permissions
    .filter((p) => p.view || p.edit || p.delete)
    .map((p) => p.page);
  const visiblePermissions = pagesWithPermissions.slice(0, 2);
  const remainingCount = pagesWithPermissions.length - visiblePermissions.length;

  return (
    <Card className="flex flex-col gap-4 rounded-lg border border-[#00000026] bg-[#F4F4F4] p-4 shadow-none">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-black">{role.name}</h3>
        <p className="text-sm text-[#918D8C]">{role.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="mb-2 text-sm text-[#918D8C]">Permissions ({pagesWithPermissions.length})</p>
        <div className="flex flex-wrap gap-2">
          {visiblePermissions.map((page) => (
            <Badge
              key={page}
              variant="outline"
              className="h-10 rounded-full border px-4 text-black"
            >
              {page}
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
        onClick={() => onEdit(role)}
        className="bg-gradient-yellow mt-auto w-full rounded-full text-black hover:opacity-90"
      >
        <SquarePen className="mr-2 h-4 w-4" />
        Edit Role
      </Button>
    </Card>
  );
}
