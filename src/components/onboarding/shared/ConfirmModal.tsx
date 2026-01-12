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

  const handleCancel = () => {
    if (confirmModalConfig.onCancel) {
      confirmModalConfig.onCancel();
    }
    closeConfirmModal();
  };

  return (
    <Dialog open={isConfirmModalOpen} onOpenChange={closeConfirmModal}>
      <DialogContent className="rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{confirmModalConfig.title}</DialogTitle>
          <DialogDescription className="text-base text-black">
            {confirmModalConfig.description}
          </DialogDescription>
        </DialogHeader>

        {confirmModalConfig.bulletPoints && confirmModalConfig.bulletPoints.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-base text-black">
            {confirmModalConfig.bulletPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}

        <DialogFooter className="flex-col gap-3 sm:flex-col">
          <Button
            onClick={handleConfirm}
            className="bg-gradient-yellow h-12 w-full rounded-full text-lg font-medium text-black"
          >
            {confirmModalConfig.confirmText || 'Confirm'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-12 w-full rounded-full border-gray-300 text-lg font-medium"
          >
            {confirmModalConfig.cancelText || 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
