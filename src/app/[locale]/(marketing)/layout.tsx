import { setRequestLocale } from 'next-intl/server';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <>{children}</>;
}
