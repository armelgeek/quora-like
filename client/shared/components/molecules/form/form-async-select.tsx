'use client';

import React, { useState } from 'react';
import { Controller, Control } from 'react-hook-form';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/shared/lib/utils';
import { Option } from './form-select';

interface FormAsyncSelectProps {
  name: string;
  control: Control<any>;
  loadOptions: (searchTerm: string) => Promise<Option[]>;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  debounceMs?: number;
}

export const FormAsyncSelect = ({
  name,
  control,
  loadOptions,
  label,
  placeholder = 'Search...',
  error,
  className,
  disabled,
  required,
  debounceMs = 300,
}: FormAsyncSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: options = [], isFetching } = useQuery({
    queryKey: ['async-select', search],
    queryFn: () => loadOptions(search),
    enabled: open && search.length > 0,
  });

  // Debounce search
  const handleSearchChange = React.useCallback((value: string) => {
    const handler = setTimeout(() => {
      setSearch(value);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [debounceMs]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select.Root
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
            open={open}
            onOpenChange={setOpen}
          >
            <Select.Trigger
              className={cn(
                'w-full flex items-center justify-between',
                'px-3 py-2 text-sm rounded-md border shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                'bg-white',
                disabled && 'opacity-50 cursor-not-allowed',
                error && 'border-red-500 focus:ring-red-500',
                'data-[placeholder]:text-gray-400'
              )}
            >
              <Select.Value placeholder={placeholder} />
              <Select.Icon>
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                )}
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-lg border"
                position="popper"
                sideOffset={4}
              >
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white">
                  <ChevronUp className="h-4 w-4" />
                </Select.ScrollUpButton>
                
                <div className="p-2">
                  <input
                    className="w-full px-2 py-1 text-sm border rounded"
                    placeholder="Type to search..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>

                <Select.Viewport className="p-1">
                  {isFetching ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : options.length === 0 ? (
                    <div className="py-2 text-center text-sm text-gray-500">
                      No results found
                    </div>
                  ) : (
                    options.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        className={cn(
                          'relative flex items-center px-8 py-2 text-sm rounded-sm',
                          'focus:bg-blue-50 focus:outline-none',
                          'data-[highlighted]:bg-blue-50 data-[highlighted]:outline-none',
                          'cursor-pointer select-none'
                        )}
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                          <Check className="h-4 w-4" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))
                  )}
                </Select.Viewport>

                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white">
                  <ChevronDown className="h-4 w-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
