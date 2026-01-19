'use client';

import type { UseBankProofUploadOptions, UseBankProofUploadReturn } from './types';
import type { FileUpload } from '@/types/onboarding';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useBankProofUpload({
  value,
  onChange,
  acceptedFormats,
  maxSizeMB,
}: UseBankProofUploadOptions): UseBankProofUploadReturn {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileUrlRefs = useRef<Set<string>>(new Set());

  // Clean up blob URLs on unmount
  useEffect(() => {
    const urls = fileUrlRefs.current;
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      urls.clear();
    };
  }, []);

  const validateFile = useCallback(
    (file: File): string | null => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const acceptedExtensions = acceptedFormats.split(',').map((f) => f.trim().toLowerCase());

      if (!acceptedExtensions.includes(fileExtension)) {
        return `File type ${fileExtension} is not supported. Accepted formats: ${acceptedFormats}`;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        return `File size must be less than ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedFormats, maxSizeMB]
  );

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);
      const newFiles: FileUpload[] = [];
      const errors: string[] = [];

      fileArray.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
          return;
        }

        const url = URL.createObjectURL(file);
        fileUrlRefs.current.add(url);

        newFiles.push({
          name: file.name,
          url,
          size: file.size,
        });
      });

      if (errors.length > 0) {
        setError(errors.join('; '));
      }

      if (newFiles.length > 0) {
        onChange([...value, ...newFiles]);
      }
    },
    [value, onChange, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input to allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [processFiles]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const fileToRemove = value[index];
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
        fileUrlRefs.current.delete(fileToRemove.url);
      }
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles);
    },
    [value, onChange]
  );

  const formatsList = acceptedFormats.replaceAll('.', '').replaceAll(',', ', ');

  const formatFileSize = useCallback((bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }, []);

  return {
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
  };
}
