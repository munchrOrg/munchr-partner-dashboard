'use client';

import type { HeaderProps } from '../types';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Bell, ChevronLeft, HelpCircle, LogOut, Menu, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const pathLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Order History',
  performance: 'Performance',
  reviews: 'Reviews',
  invoices: 'Invoices',
  advertising: 'Advertising',
  promotions: 'Promotions',
  menu: 'Menu',
  reels: 'Reels',
  payments: 'Payments',
  'opening-times': 'Opening Times',
  settings: 'Settings',
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Get the last segment for the current page title
  const currentSegment = segments.at(-1) ?? 'dashboard';
  const currentLabel =
    pathLabels[currentSegment] ||
    currentSegment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  // Determine back link - go to parent or dashboard
  const parentHref = segments.length > 1 ? `/${segments.slice(0, -1).join('/')}` : '/dashboard';
  const parentSegment = segments.at(-2);
  const parentLabel = parentSegment
    ? pathLabels[parentSegment] || parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1)
    : 'Home';

  return (
    <nav className="flex flex-col items-start gap-1 text-sm">
      <Link href={parentHref} className="flex items-center gap-1 text-sm font-bold text-[#918D8C]">
        <ChevronLeft className="h-4 w-4 text-gray-400" />
        {parentLabel}
      </Link>
      <span className="text-[30px] leading-none font-bold text-[#0C0017]">{currentLabel}</span>
    </nav>
  );
}

// ============================================================================
// MOBILE SECTIONS
// ============================================================================

function MobileLeftSection({ onMenuToggle }: Readonly<{ onMenuToggle: () => void }>) {
  return (
    <div className="flex items-center gap-4 lg:hidden">
      <Button variant="ghost" size="icon" onClick={onMenuToggle}>
        <Menu className="h-8 w-8" />
      </Button>
    </div>
  );
}

function MobileRightSection({
  user,
  userInitials,
}: Readonly<{
  user?: HeaderProps['user'];
  userInitials: string;
}>) {
  return (
    <div className="flex items-center gap-2 lg:hidden">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </Button>

      <UserMenu user={user} userInitials={userInitials} />
    </div>
  );
}

// ============================================================================
// DESKTOP SECTIONS
// ============================================================================

function DesktopLeftSection() {
  return (
    <div className="hidden items-center gap-4 md:flex">
      <Breadcrumbs />
    </div>
  );
}

function DesktopRightSection({
  isOpen,
  onToggleOpen,
  user,
  userInitials,
}: Readonly<{
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  user?: HeaderProps['user'];
  userInitials: string;
}>) {
  return (
    <div className="hidden items-center gap-3 sm:flex">
      <OpenClosedToggle isOpen={isOpen} onToggle={onToggleOpen} />
      <UserMenu user={user} userInitials={userInitials} />
      <Button
        variant="ghost"
        size="icon"
        className="relative size-[45px] rounded-full border border-[#00000026]"
      >
        <Bell className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        className="bg-gradient-yellow rounded-full px-3.5 py-5 text-sm font-medium text-black"
      >
        <HelpCircle className="h-5 w-5" />
        <span>Help Center</span>
      </Button>
    </div>
  );
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

function OpenClosedToggle({
  isOpen,
  onToggle,
}: Readonly<{
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}>) {
  return (
    <div className="relative h-[45px] w-[110px]">
      <span
        className={cn(
          'absolute top-1/2 z-10 -translate-y-1/2 text-sm font-medium whitespace-nowrap transition-all',
          isOpen ? 'left-4 text-white' : 'right-4 text-gray-500'
        )}
      >
        {isOpen ? 'Open' : 'Closed'}
      </span>
      <SwitchPrimitive.Root
        checked={isOpen}
        onCheckedChange={onToggle}
        className={cn(
          'group relative inline-flex h-[45px] w-[110px] items-center rounded-[30px] transition-all outline-none',
          isOpen ? 'bg-[#048204]' : 'bg-gray-200'
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block h-[36px] w-[36px] rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out',
            isOpen ? 'translate-x-[calc(110px-36px-4px)]' : 'translate-x-[4px]'
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}

function UserMenu({
  user,
  userInitials,
}: Readonly<{
  user?: HeaderProps['user'];
  userInitials: string;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0">
          <Avatar className="size-[45px] border border-[#00000026]">
            <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
            <AvatarFallback className="text-primary bg-transparent text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/sign-in' })}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// MAIN HEADER COMPONENT
// ============================================================================

export function Header({ user }: Readonly<HeaderProps>) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 md:h-[105px] lg:px-10">
      <div className="flex items-center gap-4">
        <MobileLeftSection onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <DesktopLeftSection />
      </div>

      <div className="flex items-center gap-3">
        <MobileRightSection user={user} userInitials={userInitials} />
        <DesktopRightSection
          isOpen={isOpen}
          onToggleOpen={setIsOpen}
          user={user}
          userInitials={userInitials}
        />
      </div>
    </header>
  );
}
