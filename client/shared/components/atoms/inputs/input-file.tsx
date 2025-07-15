'use client';

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface InputFileProps {
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  preview?: boolean;
  defaultValue?: string; // URL of existing file
}

export const InputFile: React.FC<InputFileProps> = ({
  onChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  preview = true,
  defaultValue,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultValue || '');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (file) {
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      if (preview) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      onChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      // Create a new FileList with our file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputRef.current.files = dataTransfer.files;

      // Trigger change event
      const event = new Event('change', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setPreviewUrl('');
    onChange(null);
    setError('');
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4',
          'hover:border-blue-500 transition-colors',
          'flex flex-col items-center justify-center gap-2',
          error ? 'border-red-500' : 'border-gray-300'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl && preview ? (
          <div className="relative w-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-40 object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag and drop or click to upload
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
