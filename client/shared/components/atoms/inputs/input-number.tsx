'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface InputNumberProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  showControls?: boolean;
  formatValue?: (value: number) => string;
}

export const InputNumber: React.FC<InputNumberProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  className,
  disabled = false,
  showControls = true,
  formatValue = (v) => v.toString(),
}) => {
  const increment = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const decrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (value < min) onChange(min);
    if (value > max) onChange(max);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showControls && (
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          className={cn(
            'p-1 rounded-md hover:bg-gray-100',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Minus size={16} />
        </button>
      )}

      <input
        type="number"
        value={formatValue(value)}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(
          'w-20 px-2 py-1 text-center rounded-md border',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        )}
      />

      {showControls && (
        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= max}
          className={cn(
            'p-1 rounded-md hover:bg-gray-100',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
};
