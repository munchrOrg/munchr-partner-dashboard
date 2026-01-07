import Image from 'next/image';
import { FeatureShowcase } from '@/components/shared/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Panel - Fixed */}
      <FeatureShowcase />

      {/* Right Panel - Scrollable */}
      <div className="flex w-full flex-col overflow-y-auto py-10 lg:w-1/2">
        <header className="shrink-0 p-4 sm:p-6 md:p-8">
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

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 md:px-12 lg:px-16">
          <div className="w-full max-w-sm sm:max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
