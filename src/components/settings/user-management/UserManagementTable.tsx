'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDeletePortalUser } from '@/react-query/portal-users/mutations';
import { usePortalUsers } from '@/react-query/portal-users/queries';
import { UserFormDrawer } from './UserFormDrawer';

export function UserManagementTable() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { data, isLoading, isError } = usePortalUsers();
  const deleteUserMutation = useDeletePortalUser();

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setSelectedUser(null);
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }
  if (isError) {
    return <div>Failed to load users.</div>;
  }

  const users = data?.data || [];

  return (
    <>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles?.[0]?.name || '-'}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === 'suspended'
                        ? 'rounded bg-red-500 text-white'
                        : 'rounded bg-green-500 text-[#2C2F2E]'
                    }
                  >
                    {user.status === 'approved'
                      ? 'Approved'
                      : user.status === 'suspended'
                        ? 'Suspended'
                        : 'Pending'}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 rounded-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-yellow h-10 w-24 rounded-full text-black hover:opacity-90"
                      onClick={() => handleEdit(user)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_4284_6960)">
                          <path
                            d="M9.64279 11.5718L5.78564 12.2661L6.4285 8.35748L13.7956 1.01605C13.9152 0.895546 14.0574 0.799896 14.214 0.734622C14.3707 0.669348 14.5388 0.635742 14.7085 0.635742C14.8782 0.635742 15.0463 0.669348 15.203 0.734622C15.3596 0.799896 15.5018 0.895546 15.6214 1.01605L16.9842 2.37891C17.1047 2.49844 17.2004 2.64064 17.2656 2.79731C17.3309 2.95399 17.3645 3.12204 17.3645 3.29177C17.3645 3.4615 17.3309 3.62955 17.2656 3.78622C17.2004 3.9429 17.1047 4.0851 16.9842 4.20463L9.64279 11.5718Z"
                            stroke="#000001"
                            strokeWidth="1.28571"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.4285 12.2151V16.0723C15.4285 16.4133 15.2931 16.7403 15.052 16.9814C14.8108 17.2225 14.4838 17.358 14.1428 17.358H1.92854C1.58754 17.358 1.26052 17.2225 1.0194 16.9814C0.778281 16.7403 0.642822 16.4133 0.642822 16.0723V3.85798C0.642822 3.51699 0.778281 3.18996 1.0194 2.94884C1.26052 2.70772 1.58754 2.57227 1.92854 2.57227H5.78568"
                            stroke="#000001"
                            strokeWidth="1.28571"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_4284_6960">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 rounded-full"
                      onClick={() => handleDeleteClick(user.id)}
                      disabled={deleteUserMutation.isPending || user.status === 'suspended'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserFormDrawer open={isDrawerOpen} onOpenChange={handleDrawerClose} user={selectedUser} />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this user?</div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={deleteUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteUserMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
