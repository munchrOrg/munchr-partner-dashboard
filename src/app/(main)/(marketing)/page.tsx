import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Munchr Partner Dashboard',
  description: 'Partner dashboard for Munchr',
};

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Munchr Partner Dashboard</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Manage your restaurant, orders, and customers all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/sign-in">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
