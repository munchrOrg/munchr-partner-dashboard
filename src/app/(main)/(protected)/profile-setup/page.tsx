'use client';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
import { ProfileSetupStepper } from '@/components/profile-setup/ProfileSetupStepper';
// import { useProfileSetupStore } from '@/stores/profile-setup-store';

export default function ProfileSetupPage() {
  // const { data: session, status } = useSession();
  // const router = useRouter();
  // const { isCompleted } = useProfileSetupStore();

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/sign-in');
  //     return;
  //   }

  //   if (status === 'authenticated' && isCompleted) {
  //     router.push('/dashboard');
  //   }
  // }, [status, isCompleted, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // if (status === 'unauthenticated') {
  //   return null;
  // }

  // if (isCompleted) {
  //   return null;
  // }

  return (
    <div className="bg-background min-h-screen">
      <ProfileSetupStepper />
    </div>
  );
}
