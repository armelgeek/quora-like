'use client';

import React from 'react';
import { Controller, Control } from 'react-hook-form';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  control: Control<any>;
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormSelect = ({
  name,
  control,
  options,
  label,
  placeholder = 'Select an option',
  error,
  className,
  disabled,
  required,
}: FormSelectProps) => {
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
                <ChevronDown className="h-4 w-4 opacity-50" />
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
                
                <Select.Viewport className="p-1">
                  {options.map((option) => (
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
                  ))}
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
