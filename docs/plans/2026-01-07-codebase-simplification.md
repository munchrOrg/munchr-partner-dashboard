# Codebase Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify bloated Next.js boilerplate to a clean, server-side focused app with NextAuth, Shadcn, React Query, and essential tooling.

**Architecture:** Remove all ORMs, external auth (Clerk), testing frameworks (Playwright/Vitest), and CI/CD. Add NextAuth with email/password + OTP, Shadcn UI, React Query + Axios, Husky hooks.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, NextAuth, Shadcn, React Query, Axios, Zod, RHF, Storybook (autodocs), Sentry

---

## Phase 1: Cleanup - Remove Bloated Code

### Task 1: Remove GitHub Actions and CI/CD configs

**Files:**

- Delete: `.github/workflows/` (entire folder)
- Delete: `.github/actions/` (entire folder)
- Delete: `codecov.yml`
- Delete: `.coderabbit.yaml`

**Step 1: Remove files**

```bash
rm -rf .github/workflows .github/actions
rm -f codecov.yml .coderabbit.yaml
```

---

### Task 2: Remove Testing Frameworks

**Files:**

- Delete: `tests/` (entire folder)
- Delete: `playwright.config.ts`
- Delete: `vitest.config.mts`
- Delete: `.storybook/vitest.config.mts` (if exists)

**Step 1: Remove test files and configs**

```bash
rm -rf tests
rm -f playwright.config.ts vitest.config.mts
rm -f .storybook/vitest.config.mts
```

---

### Task 3: Remove Database/ORM

**Files:**

- Delete: `migrations/` (entire folder)
- Delete: `src/models/` (entire folder)
- Delete: `src/libs/DB.ts`
- Delete: `src/utils/DBConnection.ts`
- Delete: `drizzle.config.ts`

**Step 1: Remove database files**

```bash
rm -rf migrations src/models
rm -f src/libs/DB.ts src/utils/DBConnection.ts drizzle.config.ts
```

---

### Task 4: Remove Monitoring Tools (except Sentry)

**Files:**

- Delete: `src/libs/Arcjet.ts`
- Delete: `src/libs/Logger.ts`
- Delete: `src/components/analytics/PostHogProvider.tsx`
- Delete: `checkly.config.ts`
- Delete: `crowdin.yml`
- Delete: `knip.config.ts`

**Step 1: Remove monitoring files**

```bash
rm -f src/libs/Arcjet.ts src/libs/Logger.ts
rm -f src/components/analytics/PostHogProvider.tsx
rm -f checkly.config.ts crowdin.yml knip.config.ts
```

---

### Task 5: Remove Clerk Auth

**Files:**

- Modify: `src/app/[locale]/(auth)/layout.tsx` - Remove ClerkProvider
- Delete: Any Clerk-specific components/pages

**Step 1: Identify and remove Clerk usage**
Search for all Clerk imports and remove them. Replace auth layout with simple layout.

---

### Task 6: Remove Lefthook

**Files:**

- Delete: `lefthook.yml`

**Step 1: Remove lefthook config**

```bash
rm -f lefthook.yml
```

---

### Task 7: Clean package.json - Remove unused dependencies

**Files:**

- Modify: `package.json`

**Dependencies to remove:**

```
@arcjet/next
@clerk/localizations
@clerk/nextjs
@logtape/logtape
drizzle-orm
pg
posthog-js
```

**DevDependencies to remove:**

```
@chromatic-com/playwright
@electric-sql/pglite-socket
@faker-js/faker
@playwright/test
@storybook/addon-vitest
@types/pg
@vitest/browser
@vitest/browser-playwright
@vitest/coverage-v8
checkly
drizzle-kit
eslint-plugin-playwright
get-db
knip
lefthook
semantic-release
vitest
vitest-browser-react
conventional-changelog-conventionalcommits
```

**Step 1: Update package.json and reinstall**

```bash
npm uninstall @arcjet/next @clerk/localizations @clerk/nextjs @logtape/logtape drizzle-orm pg posthog-js
npm uninstall -D @chromatic-com/playwright @electric-sql/pglite-socket @faker-js/faker @playwright/test @storybook/addon-vitest @types/pg @vitest/browser @vitest/browser-playwright @vitest/coverage-v8 checkly drizzle-kit eslint-plugin-playwright get-db knip lefthook semantic-release vitest vitest-browser-react conventional-changelog-conventionalcommits
```

---

### Task 8: Clean package.json scripts

**Files:**

- Modify: `package.json`

**Scripts to remove:**

- All `db:*` scripts
- All `db-*` scripts
- `neon:*` scripts
- `test`, `test:e2e`
- `storybook:test`
- `check:deps`
- `commit`

**Scripts to keep/modify:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "check:types": "tsc --noEmit --pretty",
    "check:i18n": "i18n-check -l src/locales -s en -u src -f next-intl",
    "clean": "rimraf .next out",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    "prepare": "husky"
  }
}
```

---

## Phase 2: Add New Dependencies

### Task 9: Install new packages

**Step 1: Install production dependencies**

```bash
npm install next-auth@beta bcryptjs @tanstack/react-query axios
```

**Step 2: Install dev dependencies**

```bash
npm install -D @types/bcryptjs husky lint-staged prettier
```

---

### Task 10: Initialize Shadcn UI

**Step 1: Initialize shadcn**

```bash
npx shadcn@latest init
```

- Style: Default
- Base color: Neutral
- CSS variables: Yes

**Step 2: Install comprehensive component set**

```bash
npx shadcn@latest add button input label card form toast dialog dropdown-menu avatar separator badge alert
```

---

## Phase 3: Setup Core Infrastructure

### Task 11: Setup Husky + lint-staged

**Files:**

- Create: `.husky/pre-commit`
- Create: `.husky/pre-push`
- Modify: `package.json` (add lint-staged config)

**Step 1: Initialize Husky**

```bash
npx husky init
```

**Step 2: Create pre-commit hook**
Create `.husky/pre-commit`:

```bash
npx lint-staged
```

**Step 3: Create pre-push hook**
Create `.husky/pre-push`:

```bash
npm run build
```

**Step 4: Add lint-staged config to package.json**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

---

### Task 12: Setup Prettier

**Files:**

- Create: `.prettierrc`
- Create: `.prettierignore`

**Step 1: Create .prettierrc**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Step 2: Create .prettierignore**

```
node_modules
.next
out
dist
coverage
.storybook
storybook-static
```

**Step 3: Install Tailwind plugin**

```bash
npm install -D prettier-plugin-tailwindcss
```

---

### Task 13: Setup Axios client with interceptors

**Files:**

- Create: `src/lib/axios.ts`

**Step 1: Create axios client**

```typescript
import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### Task 14: Setup React Query

**Files:**

- Create: `src/lib/query-client.ts`
- Create: `src/components/providers/QueryProvider.tsx`
- Create: `src/api/users/service.ts`
- Create: `src/api/users/types.ts`
- Create: `src/api/users/keys.ts`
- Create: `src/api/users/queries.ts`
- Create: `src/api/users/mutations.ts`
- Create: `src/api/index.ts`

**Step 1: Create query client config**
`src/lib/query-client.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
```

**Step 2: Create QueryProvider**
`src/components/providers/QueryProvider.tsx`:

```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Step 3: Create example API structure**
`src/api/users/types.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}
```

`src/api/users/keys.ts`:

```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
```

`src/api/users/service.ts`:

```typescript
import apiClient from '@/lib/axios';
import type { User, CreateUserRequest } from './types';

export const userService = {
  getAll: () => apiClient.get<User[]>('/users').then((res) => res.data),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`).then((res) => res.data),
  create: (data: CreateUserRequest) => apiClient.post<User>('/users', data).then((res) => res.data),
};
```

`src/api/users/queries.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { userKeys } from './keys';
import { userService } from './service';

export const useUsers = () =>
  useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getAll,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
```

`src/api/users/mutations.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from './keys';
import { userService } from './service';
import type { CreateUserRequest } from './types';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
```

`src/api/index.ts`:

```typescript
export * from './users/types';
export * from './users/keys';
export * from './users/queries';
export * from './users/mutations';
```

---

## Phase 4: Authentication Setup

### Task 15: Create Mock User Store

**Files:**

- Create: `src/stores/mock-users.ts`

**Step 1: Create mock store**

```typescript
export interface MockUser {
  id: string;
  email: string;
  password: string; // hashed
  verified: boolean;
  otp?: string;
  otpExpiry?: Date;
}

// In-memory store - resets on server restart
export const users: MockUser[] = [];

export const findUserByEmail = (email: string) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

export const findUserById = (id: string) => users.find((u) => u.id === id);

export const addUser = (user: MockUser) => {
  users.push(user);
  return user;
};

export const updateUser = (id: string, updates: Partial<MockUser>) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
```

---

### Task 16: Create Auth Validation Schemas

**Files:**

- Create: `src/validations/auth.ts`

**Step 1: Create Zod schemas**

```typescript
import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
```

---

### Task 17: Setup NextAuth Configuration

**Files:**

- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

**Step 1: Create auth config**
`src/lib/auth.ts`:

```typescript
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/stores/mock-users';

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = findUserByEmail(credentials.email as string);
        if (!user) {
          return null;
        }

        if (!user.verified) {
          throw new Error('Please verify your email first');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};
```

**Step 2: Create auth route handler**
`src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth';

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
```

---

### Task 18: Create Auth API Routes (Sign Up + OTP)

**Files:**

- Create: `src/app/api/auth/sign-up/route.ts`
- Create: `src/app/api/auth/verify-otp/route.ts`
- Create: `src/app/api/auth/resend-otp/route.ts`

**Step 1: Create sign-up route**
`src/app/api/auth/sign-up/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/validations/auth';
import { findUserByEmail, addUser, generateOTP, updateUser } from '@/stores/mock-users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { email, password } = result.data;

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = addUser({
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      verified: false,
      otp,
      otpExpiry,
    });

    // Log OTP for development (will be sent via backend API later)
    console.log(`[OTP] User: ${email}, OTP: ${otp}`);

    return NextResponse.json({
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
      // Include OTP in response for development (show in toast)
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Step 2: Create verify-otp route**
`src/app/api/auth/verify-otp/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { otpSchema } from '@/validations/auth';
import { findUserById, updateUser } from '@/stores/mock-users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, otp } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ error: 'Already verified' }, { status: 400 });
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json({ error: 'No OTP found' }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    updateUser(userId, {
      verified: true,
      otp: undefined,
      otpExpiry: undefined,
    });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Step 3: Create resend-otp route**
`src/app/api/auth/resend-otp/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { findUserById, updateUser, generateOTP } from '@/stores/mock-users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ error: 'Already verified' }, { status: 400 });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    updateUser(userId, { otp, otpExpiry });

    console.log(`[OTP] User: ${user.email}, OTP: ${otp}`);

    return NextResponse.json({
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Phase 5: Auth Pages

### Task 19: Create Sign In Page

**Files:**

- Create: `src/app/[locale]/(auth)/sign-in/page.tsx`

**Step 1: Create sign-in page with RHF + Zod**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { signInSchema, type SignInInput } from '@/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Task 20: Create Sign Up Page

**Files:**

- Create: `src/app/[locale]/(auth)/sign-up/page.tsx`

**Step 1: Create sign-up page**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { signUpSchema, type SignUpInput } from '@/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
        return;
      }

      // Show OTP in toast for development
      if (result.otp) {
        toast({
          title: 'OTP Code (Dev Only)',
          description: `Your OTP is: ${result.otp}`,
          duration: 30000,
        });
      }

      // Store userId for OTP verification
      sessionStorage.setItem('pendingUserId', result.userId);
      router.push('/verify-otp');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Enter your details to create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Task 21: Create OTP Verification Page

**Files:**

- Create: `src/app/[locale]/(auth)/verify-otp/page.tsx`

**Step 1: Create verify-otp page**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OTPInput } from '@/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function VerifyOTPPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const pendingUserId = sessionStorage.getItem('pendingUserId');
    if (!pendingUserId) {
      router.push('/sign-up');
      return;
    }
    setUserId(pendingUserId);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OTPInput) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: data.otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
        return;
      }

      sessionStorage.removeItem('pendingUserId');
      toast({
        title: 'Success',
        description: 'Email verified! You can now sign in.',
      });
      router.push('/sign-in');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!userId) return;

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'OTP Sent',
          description: result.otp
            ? `Your new OTP is: ${result.otp}`
            : 'Check your email for the new OTP',
          duration: 30000,
        });
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                {...register('otp')}
              />
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={resendOTP}
                className="text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Task 22: Create Dashboard Page (Protected)

**Files:**

- Create: `src/app/[locale]/(protected)/dashboard/page.tsx`
- Create: `src/app/[locale]/(protected)/layout.tsx`

**Step 1: Create protected layout**
`src/app/[locale]/(protected)/layout.tsx`:

```typescript
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
```

**Step 2: Create dashboard page**
`src/app/[locale]/(protected)/dashboard/page.tsx`:

```typescript
import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, {session?.user?.email}!</p>
          <p className="text-gray-500 mt-2">You are now logged in.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Phase 6: Update Layouts and Providers

### Task 23: Update Root Layout

**Files:**

- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Add providers (QueryProvider, Toaster)**
Wrap app with QueryProvider and add Toaster component.

---

### Task 24: Create Auth Layout

**Files:**

- Modify: `src/app/[locale]/(auth)/layout.tsx`

**Step 1: Remove Clerk, create simple centered layout**

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
```

---

## Phase 7: SEO Setup

### Task 25: Create Sitemap

**Files:**

- Create: `src/app/sitemap.ts`

**Step 1: Create static sitemap**

```typescript
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
```

---

### Task 26: Create Robots.txt

**Files:**

- Create: `src/app/robots.ts`

**Step 1: Create robots config**

```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## Phase 8: Storybook Setup

### Task 27: Configure Storybook for Autodocs

**Files:**

- Modify: `.storybook/main.ts`
- Modify: `.storybook/preview.ts`

**Step 1: Enable autodocs in main.ts**
Add docs configuration with autodocs: 'tag'.

**Step 2: Create sample component story**
Create `src/components/ui/button.stories.tsx` as template.

---

## Phase 9: Cleanup and Verify

### Task 28: Update next.config.ts

**Files:**

- Modify: `next.config.ts`

**Step 1: Remove database and unused plugin configs**
Remove Drizzle, simplify Sentry config if needed.

---

### Task 29: Update Environment Variables

**Files:**

- Modify: `.env.example`
- Modify: `src/libs/Env.ts`

**Step 1: Remove database env vars, add NextAuth vars**

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Task 30: Final Verification

**Step 1: Install dependencies**

```bash
npm install
```

**Step 2: Run lint**

```bash
npm run lint
```

**Step 3: Run build**

```bash
npm run build
```

**Step 4: Test dev server**

```bash
npm run dev
```

**Step 5: Test auth flow manually**

- Sign up → OTP shown in toast → Verify → Sign in → Dashboard

---

## Summary

Total tasks: 30
Phases: 9

1. **Cleanup** (Tasks 1-8): Remove bloated code
2. **Dependencies** (Tasks 9-10): Install new packages + Shadcn
3. **Infrastructure** (Tasks 11-14): Husky, Prettier, Axios, React Query
4. **Authentication** (Tasks 15-18): Mock store, schemas, NextAuth, API routes
5. **Auth Pages** (Tasks 19-22): Sign in, Sign up, OTP, Dashboard
6. **Layouts** (Tasks 23-24): Update providers and layouts
7. **SEO** (Tasks 25-26): Sitemap and robots
8. **Storybook** (Task 27): Autodocs setup
9. **Final** (Tasks 28-30): Config cleanup and verification
