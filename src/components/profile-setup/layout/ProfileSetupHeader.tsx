import Image from 'next/image';

export function ProfileSetupHeader() {
  return (
    <header className="flex h-30 items-end justify-start bg-white px-4 pb-3.5 md:px-16">
      <div className="relative h-6 w-36">
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
