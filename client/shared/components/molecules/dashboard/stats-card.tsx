'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}) => {
  return (
    <div className={cn(
      'p-6 bg-white rounded-xl shadow-sm border',
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-primary-50 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center justify-between">
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center text-sm',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span className="font-medium">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
