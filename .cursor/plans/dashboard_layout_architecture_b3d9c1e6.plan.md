---
name: Dashboard Layout Architecture
overview: Create a performant dashboard layout with sidebar navigation and header, following Next.js 16 best practices for server/client component separation. Set up the architecture for efficient data fetching and rendering.
todos:
  - id: create-dashboard-layout
    content: Create DashboardLayout server component that wraps protected routes with sidebar and header
    status: pending
  - id: create-sidebar
    content: Create Sidebar server component and SidebarNav client component for navigation
    status: pending
  - id: create-header
    content: Create Header client component with breadcrumbs, user menu, notifications, and help button
    status: pending
  - id: update-protected-layout
    content: Update protected layout to integrate DashboardLayout component
    status: pending
    dependencies:
      - create-dashboard-layout
  - id: refactor-dashboard-page
    content: Refactor dashboard page to server component with client widget components
    status: pending
    dependencies:
      - create-dashboard-layout
  - id: create-dashboard-service
    content: Create dashboard data service, queries, types, and keys for React Query
    status: pending
  - id: create-widget-components
    content: Create reusable dashboard widget components (StatsCard, DashboardContent) with placeholder structure
    status: pending
    dependencies:
      - create-dashboard-service
---

# Dashboard Layout Architecture Plan

## Overview

Create a dashboard layout with sidebar navigation and header bar, following Next.js 16 App Router best practices. The layout will use server components where possible for optimal performance, with client components only for interactive features.

## Architecture Strategy

### Server vs Client Component Strategy

**Server Components (Default):**

- Layout wrapper components
- Sidebar navigation (static structure)
- Header bar (static structure)
- Initial data fetching for dashboard metrics
- Static content and metadata

**Client Components:**

- Interactive navigation (active states, routing)
- User dropdown menu
- Notifications bell
- Toggle switches
- Real-time data updates (React Query)
- Interactive dashboard widgets

### Data Fetching Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Server Component (Layout)                              │
│  - Fetches initial session/user data                    │
│  - Passes to client components as props                 │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Server Component (Dashboard Page)                      │
│  - Fetches initial dashboard stats (SSR)                │
│  - Uses React Server Components                         │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Client Components (Interactive Widgets)                │
│  - Uses React Query for real-time updates               │
│  - Handles user interactions                            │
│  - Polls for fresh data                                 │
└─────────────────────────────────────────────────────────┘
```

## Implementation Plan

### 1. Create Dashboard Layout Component

**File:** `src/components/dashboard/layout/DashboardLayout.tsx` (Server Component)

- Wraps all protected routes with sidebar and header
- Fetches user session data server-side
- Passes user data to client components as props

### 2. Create Sidebar Navigation

**File:** `src/components/dashboard/layout/Sidebar.tsx` (Server Component)

- Static navigation structure
- Navigation items based on image: Dashboard, Order History, Performance, Reviews, Invoices, Advertising, Promotions, Menu, Reels, Payments, Opening Times, Settings
- Uses Next.js Link components for navigation

**File:** `src/components/dashboard/layout/SidebarNav.tsx` (Client Component)

- Handles active route highlighting
- Manages navigation state
- Receives navigation items as props from server component

### 3. Create Header Component

**File:** `src/components/dashboard/layout/Header.tsx` (Client Component)

- Breadcrumb navigation
- Business selector dropdown
- Open/Closed toggle switch
- User avatar and dropdown
- Notifications bell
- Help Center button

### 4. Update Protected Layout

**File:** `src/app/(main)/(protected)/layout.tsx`

- Integrate DashboardLayout component
- Maintains existing auth check
- Wraps children with dashboard layout

### 5. Refactor Dashboard Page

**File:** `src/app/(main)/(protected)/dashboard/page.tsx`

- Convert to Server Component for initial data fetching
- Create separate client components for interactive widgets
- Set up React Query hooks for dashboard data
- Create placeholder structure for dashboard content area

### 6. Create Dashboard Data Service

**File:** `src/react-query/dashboard/service.ts`

- API service functions for dashboard endpoints
- Types for dashboard data

**File:** `src/react-query/dashboard/queries.ts`

- React Query hooks for dashboard data
- Query keys for caching

**File:** `src/react-query/dashboard/types.ts`

- TypeScript types for dashboard data structures

### 7. Create Dashboard Widget Components

**File:** `src/components/dashboard/widgets/StatsCard.tsx` (Client Component)

- Reusable stat card component
- Displays metrics with icons

**File:** `src/components/dashboard/widgets/DashboardContent.tsx` (Client Component)

- Main dashboard content area
- Grid layout for widgets
- Placeholder structure for future data

## File Structure

```
src/
├── app/(main)/(protected)/
│   ├── layout.tsx (updated)
│   └── dashboard/
│       └── page.tsx (refactored to server component)
├── components/
│   └── dashboard/
│       ├── layout/
│       │   ├── DashboardLayout.tsx (server)
│       │   ├── Sidebar.tsx (server)
│       │   ├── SidebarNav.tsx (client)
│       │   └── Header.tsx (client)
│       └── widgets/
│           ├── StatsCard.tsx (client)
│           └── DashboardContent.tsx (client)
└── react-query/
    └── dashboard/
        ├── service.ts
        ├── queries.ts
        ├── types.ts
        └── keys.ts
```

## Performance Optimizations

1. **Server-Side Rendering**: Initial dashboard data fetched on server
2. **Streaming**: Use React Suspense for progressive loading
3. **Caching**: React Query with appropriate stale times
4. **Code Splitting**: Lazy load dashboard widgets
5. **Static Navigation**: Sidebar structure rendered server-side
6. **Minimal Client JS**: Only interactive parts are client components

## Data Flow

1. **Initial Load**: Server fetches user session and initial dashboard stats
2. **Hydration**: Client components hydrate with server data
3. **Real-time Updates**: React Query handles subsequent data fetching
4. **Caching**: Query cache prevents unnecessary refetches
5. **Optimistic Updates**: For user interactions (toggle switches, etc.)

## Next Steps After Implementation

1. Add specific API endpoints for dashboard metrics
2. Implement individual dashboard widgets (charts, tables, etc.)
3. Add real-time data polling where needed
4. Implement error boundaries for data fetching
5. Add loading states and skeletons
