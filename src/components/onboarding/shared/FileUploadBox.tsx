'use client';

import type { FileUpload, FileUploadBoxProps } from '@/types/onboarding';
import { Link2, X } from 'lucide-react';

import { useRef, useState } from 'react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create file upload object
    const fileUpload: FileUpload = {
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    };

    onChange(fileUpload);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatsList = acceptedFormats.replace(/\./g, '').replace(/,/g, ', ');

  return (
    <div className="border-2 border-dashed border-gray-300 p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="bg-purple-dark rounded px-3 py-1 text-sm font-medium text-white">
          {label}
        </span>
      </div>

      {value ? (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-700">{value.name}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-full p-1 hover:bg-gray-200"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <Link2 className="mb-2 h-6 w-6 text-gray-400" />

          <p className="mb-1 text-base font-bold">Drag your file</p>

          <p className="mb-3 text-base">
            Accepted formats {formatsList} with maximum size of {maxSizeMB} MB
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
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
