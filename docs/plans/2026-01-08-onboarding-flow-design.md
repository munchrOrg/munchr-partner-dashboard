# Onboarding Flow Design

## Overview

Implement a multi-step onboarding flow after user signup, guiding partners through business setup, location verification, and document upload.

## User Flow

```
Sign Up → Verify Email → Verify Phone → Welcome → Step 1 → Step 2 → Map Confirm → Step 3 → (Step 4 later)
```

## Route Structure

```
src/app/(main)/(onboarding)/
├── layout.tsx          # Shared onboarding layout (header + footer)
├── welcome/page.tsx    # Welcome page after signup
├── step-1/page.tsx     # Add your business (info display)
├── step-2/page.tsx     # Location form
└── step-3/page.tsx     # Document upload
```

## Step Enum

```typescript
enum OnboardingStep {
  WELCOME = 'welcome',
  ADD_BUSINESS = 'add-business',
  BUSINESS_LOCATION = 'business-location',
  VERIFY_DOCUMENTS = 'verify-documents',
}
```

## Pages

### Welcome Page (`/welcome`)

- Displays "Thank you for signing up" heading
- Shows 3-step overview list (Add business, Verify business, Open for business)
- Uses `welcomeThumbnail` icon illustration
- Footer: No Back button, See Progress (menuIcon), Continue → `/step-1`

### Step 1: Add Your Business (`/step-1`)

- Display only (no form)
- Shows "What do we need from you" list:
  - Details of your business
  - Location of your business
  - Legal and Sales Tax details
  - Banking Details
  - Choose the best plan for your business
- Footer: Back → `/welcome`, See Progress, Continue → `/step-2`

### Step 2: Business Location (`/step-2`)

- Form fields:
  - Building or Place Name (optional)
  - Street (required)
  - House Number (required)
  - State (required)
  - City (optional)
  - Area (optional)
  - Postal Code (required)
  - Add comment about location (optional)
- On Continue: Opens MapConfirmDrawer with pinned location
- User must confirm location before proceeding
- Footer: Back → `/step-1`, See Progress, Continue → Opens map drawer

### Step 3: Verify Documents (`/step-3`)

- Title: "Upload Business Owner ID (Front and Back)"
- "See example" link → Opens ExampleIdDrawer with cnic-front.png, cnic-back.png
- SNTN Yes/No radio buttons:
  - Yes → Show SNTN upload box only
  - No → Show CNIC upload box only
- Simple file upload (no drag-drop)
- Accepted formats: jpg, png, jpeg, pdf, tiff, docx, xlsx (max 4MB)
- Footer: Back → `/step-2`, See Progress, Continue → Does nothing (Step 4 later)

## Components

### OnboardingFooter.tsx

- Left: Back button (optional, pill-shaped outline)
- Center: See Progress button with menuIcon
- Right: Continue button (yellow, pill-shaped)
- Props: `showBack`, `onBack`, `onContinue`, `continueDisabled`, `continueLabel`

### ProgressDrawer.tsx

- Uses shadcn Sheet (side="right")
- Title: "You're making progress!"
- Vertical timeline with 3 phases:
  1. Add your business - "We need this to create your contract and set up your business on the munchr app"
  2. Verify your business - "Add a few documents so we can verify your business and identity"
  3. Open for business - "Get your restaurant live on the munchr app. Start taking orders and earning new revenue!"
- Radio-style indicators showing current/completed phases

### MapConfirmDrawer.tsx

- Uses shadcn Sheet (side="right")
- Google Map with marker at geocoded address
- Uses `@react-google-maps/api` library
- "Confirm Location" button
- On confirm: Saves coordinates to store, navigates to Step 3

### ExampleIdDrawer.tsx

- Uses shadcn Sheet (side="right")
- Bordered container with:
  - "Front" heading + /public/cnic-front.png image
  - "Back" heading + /public/cnic-back.png image

### FileUploadBox.tsx

- Reusable upload component
- Props: `label` (badge text like "ID Card" or "SNTN"), `onFileSelect`, `acceptedFormats`, `maxSizeMB`
- Dashed border box with:
  - Purple badge/label in top-left
  - Link icon
  - "Drag your file" text (visual only, no drag-drop functionality)
  - Accepted formats text
  - "Upload from your device" link triggers file input

## Zustand Store

```typescript
// src/stores/onboarding-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

enum OnboardingStep {
  WELCOME = 'welcome',
  ADD_BUSINESS = 'add-business',
  BUSINESS_LOCATION = 'business-location',
  VERIFY_DOCUMENTS = 'verify-documents',
}

interface LocationData {
  buildingName?: string;
  street: string;
  houseNumber: string;
  state: string;
  city?: string;
  area?: string;
  postalCode: string;
  comment?: string;
  latitude?: number;
  longitude?: number;
  isConfirmed: boolean;
}

interface DocumentData {
  hasSNTN: boolean | null;
  idCardFile?: File;
  sntnFile?: File;
}

interface OnboardingState {
  currentStep: OnboardingStep;
  location: LocationData;
  documents: DocumentData;

  setCurrentStep: (step: OnboardingStep) => void;
  setLocation: (data: Partial<LocationData>) => void;
  setDocuments: (data: Partial<DocumentData>) => void;
  confirmLocation: (lat: number, lng: number) => void;
  resetOnboarding: () => void;
}

// Persisted to localStorage
```

## Validation Schema

```typescript
// src/validations/onboarding.ts
import { z } from 'zod';

export const locationSchema = z.object({
  buildingName: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().optional(),
  area: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  comment: z.string().optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;
```

## Integration Changes

### Redirect After Signup

**File:** `src/components/pages/verify/VerifyOtpForm.tsx`

- Change: After phone verification, redirect to `/welcome` instead of `/dashboard`

### Environment Variables

Add to `.env`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Dependencies

### NPM Packages

```bash
npm install @react-google-maps/api
```

### shadcn Components

```bash
npx shadcn@latest add sheet
```

## Files to Create

1. `src/app/(main)/(onboarding)/layout.tsx`
2. `src/app/(main)/(onboarding)/welcome/page.tsx`
3. `src/app/(main)/(onboarding)/step-1/page.tsx`
4. `src/app/(main)/(onboarding)/step-2/page.tsx`
5. `src/app/(main)/(onboarding)/step-3/page.tsx`
6. `src/components/onboarding/OnboardingFooter.tsx`
7. `src/components/onboarding/ProgressDrawer.tsx`
8. `src/components/onboarding/MapConfirmDrawer.tsx`
9. `src/components/onboarding/ExampleIdDrawer.tsx`
10. `src/components/onboarding/FileUploadBox.tsx`
11. `src/stores/onboarding-store.ts`
12. `src/validations/onboarding.ts`

## Files to Modify

1. `src/components/pages/verify/VerifyOtpForm.tsx` - Change redirect to `/welcome`

## UI References

- Icons: `welcomeThumbnail`, `menuIcon` from `src/lib/icon.tsx`
- Example images: `/public/cnic-front.png`, `/public/cnic-back.png`
- Colors: Purple (#310260), Yellow (#FEBD10) - brand colors
- Button styles: Yellow pill for primary, outline pill for secondary
