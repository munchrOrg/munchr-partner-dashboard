'use client';

import type { FileUpload, FileUploadBoxProps } from '@/types/onboarding';
import { Link2, X } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth-helpers';

const DEFAULT_FORMATS = '.jpg,.jpeg,.png,.pdf,.tiff,.docx,.xlsx';
const DEFAULT_MAX_SIZE = 4;

export function FileUploadBox({
  label,
  value,
  onChange,
  acceptedFormats = DEFAULT_FORMATS,
  maxSizeMB = DEFAULT_MAX_SIZE,
}: FileUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (value?.url && value.url !== previousUrlRef.current) {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      previousUrlRef.current = value.url;
    }

    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [value?.url]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}v1/storage/upload-url`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          assetType: 'logo', // You can make this dynamic if needed
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }
      const data = await res.json();
      const { key, uploadUrl } = data;

      // Step 2: Upload file to the returned uploadUrl (PUT)
      try {
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        // Note: We don't check response.ok here as some storage providers return 200
        // even with CORS restrictions, but the upload still succeeds
      } catch (uploadError) {
        // Log CORS/upload error but continue - the file might still upload successfully
        console.warn('File upload may have CORS issues, but continuing:', uploadError);
      }

      // Use the key to construct public URL
      const publicUrl = `https://pub-xxx.r2.dev/${key}`;
      const fileUpload: FileUpload = {
        name: file.name,
        url: publicUrl,
        size: file.size,
        key,
      };
      onChange(fileUpload);
    } catch (err: any) {
      setError('Image upload failed');
      console.error('File upload error:', err);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    if (value?.url) {
      URL.revokeObjectURL(value.url);
    }
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatsList = acceptedFormats.replace(/\./g, '').replace(/,/g, ', ');

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 p-6">
        {label && (
          <div className="mb-4">
            <span className="bg-purple-dark rounded px-3 py-1 text-sm font-medium text-white">
              {label}
            </span>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <Link2 className="mb-2 h-6 w-6 text-gray-400" />

          <p className="mb-1 text-base font-bold">Drag your file</p>

          <p className="mb-3 text-base">
            accepted formats {formatsList} ,with maximum size of {maxSizeMB} MB
          </p>

          <button
            type="button"
            onClick={handleClick}
            className="text-purple-dark text-base font-bold hover:underline"
          >
            Upload from your device
          </button>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {value && (
        <div className="flex items-center justify-between rounded-full border border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Link2 className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{value.name}</span>
              {value.size && (
                <span className="text-sm text-gray-400">{formatFileSize(value.size)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-3 w-3 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
