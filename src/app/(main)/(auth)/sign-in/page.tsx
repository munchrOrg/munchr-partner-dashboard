'use client';

import Image from 'next/image';
import { useState } from 'react';
import { EmailLoginForm, FeatureShowcase, PhoneLoginForm } from '@/components/pages/sign-in';

type LoginMethod = 'email' | 'phone';

export default function SignInPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  const switchToPhone = () => setLoginMethod('phone');
  const switchToEmail = () => setLoginMethod('email');

  return (
    <div className="flex min-h-screen bg-white">
      <FeatureShowcase />

      <div className="flex w-full flex-col lg:w-1/2">
        <header className="p-4 sm:p-6 md:p-8">
          <div className="relative h-14 w-40 sm:h-16 sm:w-48 md:h-20 md:w-56">
            <Image
              src="/logo.png"
              alt="munchr"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </header>

        <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:px-8 md:px-12 lg:px-16">
          <div className="w-full max-w-sm sm:max-w-md">
            {loginMethod === 'email' ? (
              <EmailLoginForm onSwitchToPhone={switchToPhone} />
            ) : (
              <PhoneLoginForm onSwitchToEmail={switchToEmail} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
