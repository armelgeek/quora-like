'use client';

import React, { useEffect, useRef } from 'react';

import { cn } from '@/shared/lib/utils';
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  maxHeight?: number;
  showCharCount?: boolean;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  className,
  autoResize = true,
  maxHeight = 400,
  showCharCount = false,
  maxLength,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea && autoResize) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    if (autoResize) {
      adjustHeight();
    }
  };

  const charCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && charCount >= maxLength * 0.9;

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        className={cn(
          'w-full px-3 py-2 rounded-md border',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'resize-none',
          className
        )}
        style={{
          minHeight: props.rows ? `${props.rows * 1.5}rem` : '80px',
          maxHeight: `${maxHeight}px`
        }}
        {...props}
      />

      {showCharCount && maxLength && (
        <div
          className={cn(
            'absolute bottom-2 right-2 text-xs',
            isNearLimit ? 'text-orange-500' : 'text-gray-400',
            charCount === maxLength && 'text-red-500'
          )}
        >
          {charCount}/{maxLength}
        </div>
      )}
    </div>
  );
};
