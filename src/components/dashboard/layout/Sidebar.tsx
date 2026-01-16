'use client';

import type { NavSection } from '../types';
import {
  BarChart3,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  Film,
  LayoutDashboard,
  Megaphone,
  Settings,
  Star,
  Tag,
  UtensilsCrossed,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationSections: NavSection[] = [
  {
    title: 'Monitor your performance',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Order History', href: '/orders', icon: ClipboardList },
      { label: 'Performance', href: '/performance', icon: BarChart3 },
      { label: 'Reviews', href: '/reviews', icon: Star },
      { label: 'Invoices', href: '/invoices', icon: FileText },
    ],
  },
  {
    title: 'Grow your business',
    items: [
      { label: 'Advertising', href: '/advertising', icon: Megaphone },
      { label: 'Promotions', href: '/promotions', icon: Tag },
    ],
  },
  {
    title: 'Manage your business',
    items: [
      { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
      { label: 'Reels', href: '/reels', icon: Film },
      { label: 'Payments', href: '/payments', icon: CreditCard },
      { label: 'Opening Times', href: '/opening-times', icon: Clock },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[276px] shrink-0 border-r border-[#00000026] bg-white lg:block">
      <div className="flex h-[105px] items-center pl-[30px]">
        <Image src="/munch-partner-logo.svg" alt="Munchr" width={149} height={25} />
      </div>

      <nav className="flex-1 overflow-y-auto pb-4">
        {navigationSections.map((section, sectionIndex) => (
          <div key={section.title} className={cn(sectionIndex > 0 && 'mt-[30px]')}>
            <h3 className="mb-3 ml-[30px] text-sm leading-none font-medium tracking-wider text-[#918D8C]">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.href} className="relative">
                    {isActive && (
                      <div className="from-purple-dark absolute top-1/2 left-0 h-[22px] w-[3px] -translate-y-1/2 rounded-tr-[3px] rounded-br-[3px] bg-linear-to-b to-[#FEBD10] opacity-100" />
                    )}
                    <Link
                      href={item.href}
                      className={cn(
                        'relative ml-[30px] flex items-center gap-[15px] rounded-lg py-2 text-sm font-medium text-[#0C0017] transition-colors'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'fill-[#FEBD10] text-[#FEBD10]' : 'text-[#0C0017]'
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
