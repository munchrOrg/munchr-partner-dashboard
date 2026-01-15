'use client';

import type { BankProofUploadBoxProps } from './types';
import { Link2, X } from 'lucide-react';
import { useBankProofUpload } from './useBankProofUpload';

const DEFAULT_FORMATS = '.jpg,.jpeg,.png,.pdf,.tiff,.docx,.xlsx';
const DEFAULT_MAX_SIZE = 4;

export function BankProofUploadBox({
  value = [],
  onChange,
  acceptedFormats = DEFAULT_FORMATS,
  maxSizeMB = DEFAULT_MAX_SIZE,
}: Readonly<BankProofUploadBoxProps>) {
  const {
    inputRef,
    error,
    isDragging,
    formatsList,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleClick,
    handleKeyDown,
    handleRemoveFile,
    formatFileSize,
  } = useBankProofUpload({
    value,
    onChange,
    acceptedFormats,
    maxSizeMB,
  });

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="File upload area. Drag and drop files here or press Enter or Space to select files."
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`border border-dashed border-[#00000040] px-[14px] py-[52px] transition-colors ${isDragging ? 'bg-gray-50' : 'bg-white'} cursor-pointer focus:ring-2 focus:ring-[#310260] focus:ring-offset-2 focus:outline-none`}
      >
        <div className="flex flex-col items-center text-center">
          <Link2 className="mb-2 h-6 w-6 text-gray-400" />

          <p className="mb-1 text-[14px] font-bold text-[#2C2F2E]">Drag your file</p>

          <p className="mb-3 text-[14px] font-medium text-[#2C2F2E]">
            accepted formats {formatsList} ,with maximum size of {maxSizeMB} MB
          </p>

          <button
            type="button"
            onClick={handleClick}
            className="text-[14px] font-bold text-[#310260] hover:underline"
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
          multiple
          className="hidden"
        />
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={file.url || `${file.name}-${index}`}
              className="flex items-center justify-between rounded-full border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Link2 className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  {file.size && (
                    <span className="text-sm text-gray-400">{formatFileSize(file.size)}</span>
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
                  onClick={() => handleRemoveFile(index)}
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
