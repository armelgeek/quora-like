'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  loading?: boolean;
}

export const InputSearch: React.FC<InputSearchProps> = ({
  className,
  onSearch,
  loading = false,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    props.onChange?.(e);
    onSearch?.(value);
  };

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="search"
        className={cn(
          'pl-10 pr-4 py-2 w-full rounded-md border',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          loading && 'pr-10',
          className
        )}
        onChange={handleChange}
        {...props}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}
    </div>
  );
};
