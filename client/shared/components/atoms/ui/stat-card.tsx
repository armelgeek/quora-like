import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  sublabel?: string;
  valueColor?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, sublabel, valueColor = "text-primary", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-center", className)}
        {...props}
      >
        <div className={cn("text-4xl font-bold mb-2", valueColor)}>
          {value}
        </div>
        <div className="text-lg">{label}</div>
        {sublabel && (
          <div className="text-sm opacity-75">{sublabel}</div>
        )}
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

interface StatsContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  backgroundVariant?: 'white' | 'gradient';
}

const StatsContainer = React.forwardRef<HTMLDivElement, StatsContainerProps>(
  ({ className, title, subtitle, backgroundVariant = 'gradient', children, ...props }, ref) => {
    const backgroundClasses = {
      white: 'text-gray-800',
      gradient: 'bg-gradient-to-r from-primary to-accent text-white'
    };

    return (
      <section
        ref={ref}
        className={cn(
          "pb-4",
          backgroundClasses[backgroundVariant],
          className
        )}
        {...props}
      >
        <div className="max-w-7xl">
          {(title || subtitle) && (
            <div className="">
              {title && (
                <h2 className="text-3xl uppercase font-bold mb-3 font-saira text-red-500">{title}</h2>
              )}
              {subtitle && (
                <p className={cn(
                  "text-xl",
                  backgroundVariant === 'gradient' ? 'opacity-90' : 'text-gray-600'
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 pt-16 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {children}
          </div>
        </div>
      </section>
    );
  }
);
StatsContainer.displayName = "StatsContainer";

export { StatCard, StatsContainer };
