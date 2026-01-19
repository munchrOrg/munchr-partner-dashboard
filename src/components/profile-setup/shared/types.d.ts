import type { FileUpload } from '@/types/onboarding';

export type BankProofUploadBoxProps = {
  value: FileUpload[];
  onChange: (files: FileUpload[]) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
};

export type UseBankProofUploadOptions = {
  value: FileUpload[];
  onChange: (files: FileUpload[]) => void;
  acceptedFormats: string;
  maxSizeMB: number;
};

export type UseBankProofUploadReturn = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  error: string | null;
  isDragging: boolean;
  formatsList: string;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleRemoveFile: (index: number) => void;
  formatFileSize: (bytes: number) => string;
};
