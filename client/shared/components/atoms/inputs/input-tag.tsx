'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface InputTagProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
  onMaxTagsReached?: () => void;
}

export const InputTag: React.FC<InputTagProps> = ({
  value = [],
  onChange,
  placeholder = 'Ajouter des tags...',
  className,
  maxTags = Infinity,
  onMaxTagsReached,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = inputValue.trim();

      if (tag && !value.includes(tag)) {
        if (value.length >= maxTags) {
          onMaxTagsReached?.();
          return;
        }
        onChange([...value, tag]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={cn(
      'flex flex-wrap gap-2 p-2 border rounded-md bg-white',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500',
      className
    )}>
      {value.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 outline-none bg-transparent min-w-[120px]"
      />
    </div>
  );
};
