import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Munchr Partner Dashboard',
  description: 'Partner dashboard for Munchr',
};

export default function Index() {
  redirect('/sign-in');
}
