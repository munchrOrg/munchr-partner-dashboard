'use client';

import Image from 'next/image';

export function OnboardingHeader() {
  return (
    <header className="flex h-32 items-end justify-start bg-white px-18">
      <div className="relative h-8 w-32 sm:h-10 sm:w-40">
        <Image
          src="/logo.png"
          alt="munchr partner"
          fill
          priority
          className="object-contain object-left"
        />
      </div>
    </header>
  );
}
