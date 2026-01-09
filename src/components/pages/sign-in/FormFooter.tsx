import Link from 'next/link';

export function FormFooter() {
  return (
    <>
      <p className="mt-4 text-center text-xs text-gray-400">
        By continuing you acknowledge that your personal data will be processed
        <br className="hidden sm:block" />
        <span className="sm:hidden"> </span>
        in accordance with the{' '}
        <Link href="/privacy" className="hover:underline">
          Privacy Statement
        </Link>
      </p>

      <p className="mt-6 text-center text-sm">
        No account?{' '}
        <Link href="/sign-up" className="ml-2 font-medium text-amber-500 hover:underline">
          Partner with munchr
        </Link>
      </p>
    </>
  );
}
