'use client';

import { ProfileSetupAuthGuard } from '@/components/auth/ProfileSetupAuthGuard';
import { ProfileSetupStepper } from '@/components/profile-setup/ProfileSetupStepper';

export default function ProfileSetupPage() {
  return (
    <ProfileSetupAuthGuard>
      <div className="bg-background min-h-screen">
        <ProfileSetupStepper />
      </div>
    </ProfileSetupAuthGuard>
  );
}
