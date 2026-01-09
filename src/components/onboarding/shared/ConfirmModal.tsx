'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function ConfirmModal() {
  const { isConfirmModalOpen, closeConfirmModal, confirmModalConfig } = useOnboardingStore();

  if (!confirmModalConfig) {
    return null;
  }

  const handleConfirm = () => {
    confirmModalConfig.onConfirm();
    closeConfirmModal();
  };

  return (
    <Dialog open={isConfirmModalOpen} onOpenChange={closeConfirmModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{confirmModalConfig.title}</DialogTitle>
          <DialogDescription>{confirmModalConfig.description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-gradient-yellow text-black">
            {confirmModalConfig.confirmText || 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
