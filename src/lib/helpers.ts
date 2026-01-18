import type { FileUpload } from '@/types/onboarding';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

/**
 * Create a FileUpload object from a storage key
 * Used when profile data contains only keys instead of full file objects
 */
export function createFileUploadFromKey(key: string, type: string): FileUpload {
  return {
    name: `${type} file`,
    url: `https://pub-xxx.r2.dev/${key}`,
    size: 0, // Size not available from key only
    key,
  };
}

/**
 * Check if time string is already in 24-hour format (HH:MM)
 */
export function is24HourFormat(time?: string): boolean {
  return /^\d{2}:\d{2}$/.test(time || '');
}

/**
 * Convert 12-hour format time (with AM/PM) to 24-hour format
 * Input: "10:30 AM" or "02:15 PM"
 * Output: "10:30" or "14:15"
 */
export function convertTo24HourFormat(time12h?: string): string {
  if (!time12h) {
    return '';
  }

  const parts = time12h.trim().split(' ');
  if (parts.length !== 2) {
    return '';
  }

  const timePart = parts[0];
  const modifier = parts[1];

  if (!timePart || !modifier) {
    return '';
  }

  const timeParts = timePart.split(':');
  if (timeParts.length !== 2) {
    return '';
  }

  const hours = Number(timeParts[0]);
  const minutes = Number(timeParts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return '';
  }

  let h = hours;

  if (modifier === 'PM' && h !== 12) {
    h += 12;
  }
  if (modifier === 'AM' && h === 12) {
    h = 0;
  }

  return `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Format time string to ensure it's in HH:MM format
 * Input: "10:30" or "2:5"
 * Output: "10:30" or "02:05"
 */
export function formatToHHMM(time: string | undefined): string {
  if (!time) {
    return '';
  }
  const [hour, minute] = time.split(':');
  const h = hour.padStart(2, '0');
  const m = minute.padStart(2, '0');
  return `${h}:${m}`;
}
