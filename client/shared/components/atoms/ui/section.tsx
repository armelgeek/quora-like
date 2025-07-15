import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Typography } from "@/shared/components/atoms/ui/typography";
import { PropsWithChildren, ReactNode } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  backgroundVariant?: 'white' | 'gray' | 'gradient';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  titleAlign?: 'left' | 'center' | 'right';
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    backgroundVariant = 'white', 
    containerSize = 'lg',
    spacing = 'lg',
    titleAlign = 'center',
    children, 
    ...props 
  }, ref) => {
    const backgroundClasses = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      gradient: 'bg-gradient-to-r from-primary to-accent text-white'
    };

    const containerClasses = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-7xl',
      xl: 'max-w-screen-2xl',
      full: 'max-w-full'
    };

    const spacingClasses = {
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-20'
    };

    const titleAlignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };

    return (
      <section
        ref={ref}
        className={cn(
          spacingClasses[spacing],
          backgroundClasses[backgroundVariant],
          className
        )}
        {...props}
      >
        <div className={cn(containerClasses[containerSize], 'mx-auto px-4 sm:px-6 lg:px-8')}>
          {(title || subtitle) && (
            <div className={cn('mb-12', titleAlignClasses[titleAlign])}>
              {title && (
                <h2 className={cn(
                  'text-3xl font-bold uppercase mb-4 font-saira',
                  backgroundVariant === 'gradient' ? 'text-white' : 'text-primary'
                )}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={cn(
                  'max-w-2xl text-lg',
                  titleAlign === 'center' && 'mx-auto',
                  backgroundVariant === 'gradient' ? 'text-white/90' : 'text-gray-600'
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  }
);
Section.displayName = "Section";

/**
 * @deprecated
 */
export function DeprecatedSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="grid grid-cols-6 lg:grid-cols-12">
            <div className="col-span-3 mb-12 px-8">
                <Typography as="h3">{title}</Typography>
            </div>
            <div className="col-span-9">{children}</div>
        </div>
    );
}

/**
 * @deprecated
 */
export function DeprecatedLabeledSection({
    label,
    children,
}: PropsWithChildren<{ label: string }>) {
    return (
        <div className="relative my-4 group">
            <div className="opacity-20 group-hover:opacity-100 absolute -top-8 left-0 text-slate-700 underline whitespace-nowrap">
                {label}
            </div>
            {children}
        </div>
    );
}

export { Section };
export { DeprecatedLabeledSection as LabeledSection };
