# Codebase Simplification Design

## Overview

Simplify the existing Next.js boilerplate by removing bloated integrations (ORMs, testing frameworks, CI/CD) and setting up a clean, server-side focused application with essential tooling.

## Tech Stack

| Category       | Technology                            |
| -------------- | ------------------------------------- |
| Framework      | Next.js 16 + React 19                 |
| Styling        | Tailwind CSS v4 + Shadcn UI           |
| Auth           | NextAuth (email/password + OTP)       |
| Forms          | React Hook Form + Zod                 |
| Data Fetching  | React Query + Axios                   |
| i18n           | next-intl (en/fr)                     |
| Error Tracking | Sentry                                |
| Component Docs | Storybook (autodocs)                  |
| Git Hooks      | Husky (lint on commit, build on push) |
| Formatting     | Prettier + ESLint                     |
| SEO            | Static sitemap.ts + robots.ts         |

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx
│   │   │   ├── sign-up/page.tsx
│   │   │   └── verify-otp/page.tsx
│   │   ├── (protected)/
│   │   │   └── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   └── ui/              # Shadcn components
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── axios.ts         # Axios instance + interceptors
│   └── utils.ts         # Shadcn cn() helper
├── api/
│   ├── client.ts        # React Query client + provider
│   ├── [feature]/
│   │   ├── service.ts   # API calls (axios)
│   │   ├── types.ts     # Request/Response types
│   │   ├── keys.ts      # Query key factory
│   │   ├── queries.ts   # useQuery hooks
│   │   └── mutations.ts # useMutation hooks
│   └── index.ts
├── locales/
│   ├── en.json
│   └── fr.json
├── stores/
│   └── mock-users.ts    # In-memory user storage
├── validations/
│   └── auth.ts          # Zod schemas for auth
└── styles/
    └── globals.css
```

## Authentication Flow

### Sign Up Flow

1. User submits email + password on `/sign-up`
2. User stored in memory (unverified)
3. OTP generated (6-digit, 10min expiry)
4. OTP shown via console.log + Shadcn toast
5. Redirect to `/verify-otp`
6. User enters OTP, becomes verified
7. Redirect to `/dashboard`

### Sign In Flow (verified users)

1. User submits email + password on `/sign-in`
2. Credentials validated against mock store
3. JWT session created
4. Redirect to `/dashboard`

### Mock User Store

```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed with bcrypt
  verified: boolean;
  otp?: string;
  otpExpiry?: Date;
}

export const users: User[] = [];
```

## React Query Structure

Split from start for scalability:

```
src/api/
├── client.ts                # QueryClient config + provider
├── users/
│   ├── service.ts           # API calls using axios
│   ├── types.ts             # Request/Response types
│   ├── keys.ts              # Query key factory
│   ├── queries.ts           # useQuery hooks
│   └── mutations.ts         # useMutation hooks
└── index.ts                 # Re-exports
```

### Query Keys Pattern

```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
```

## Axios Client

```typescript
import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

## Husky + Git Hooks

```
.husky/
├── pre-commit        # npx lint-staged
└── pre-push          # npm run build
```

### lint-staged config

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

## Storybook Setup

- Storybook v10 with `@storybook/nextjs-vite`
- Autodocs enabled for automatic documentation
- Stories co-located with components

### Autodocs Pattern

```typescript
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};
```

## Shadcn Components

Comprehensive starter set:

- Button, Input, Label, Card, Form
- Toast (for OTP display)
- Dialog, Dropdown, Avatar
- Separator, Badge, Alert

## What Gets Removed

### Packages

- Clerk (`@clerk/nextjs`, `@clerk/localizations`)
- Drizzle ORM, `pg`, PGLite
- Playwright, Vitest
- PostHog, Arcjet, LogTape
- Checkly, Chromatic
- Codecov, Knip, semantic-release
- Lefthook

### Files/Folders

- `/migrations`
- `/src/models`
- `/tests`
- `/.github/workflows`
- `/.github/actions`
- `drizzle.config.ts`
- `playwright.config.ts`
- `vitest.config.mts`
- `checkly.config.ts`
- `.coderabbit.yaml`
- `codecov.yml`
- `crowdin.yml`
- `lefthook.yml`
- `knip.config.ts`

### What Stays

- Sentry (error tracking)
- next-intl (i18n, without Crowdin)
- Storybook (with autodocs, without Chromatic)
- ESLint + Tailwind CSS v4

## SEO

### sitemap.ts

Static sitemap with known routes.

### robots.ts

Standard robots.txt allowing all crawlers.
