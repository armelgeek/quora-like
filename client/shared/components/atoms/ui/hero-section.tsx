"use client";
import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import { BookingForm } from '@/app/(ui)/ui/components/ui-booking-form';

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  primaryAction?: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  image?: React.ReactNode;
  backgroundVariant?: 'white' | 'gradient';
  menu?: React.ReactNode;
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({
    className,
    title,
    subtitle,
    primaryAction,
    secondaryAction,
    backgroundVariant = 'white',
    menu,
    ...props
  }, ref) => {
    const backgroundClasses = {
      white: 'bg-white text-gray-800 border-b border-gray-200',
      gradient: 'bg-gradient-to-br from-blue-500 to-purple-600 to-accent text-white'
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative py-20",
          backgroundClasses[backgroundVariant],
          className
        )}
        {...props}
      >
        <div className="max-w-7xl lg:px-40 xl:px-40 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className={cn(
                "hero-text text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-saira",
                backgroundVariant === 'white' ? 'text-gray-900' : 'text-white'
              )}>
                {title}
              </h1>
              {subtitle && (
                <p className={cn(
                  "text-xl mb-4",
                  backgroundVariant === 'white' ? 'text-gray-600' : 'text-white/90'
                )}>
                  {subtitle}
                </p>
              )}
              {menu && (
                <div className="mb-6 flex flex-wrap gap-4">
                  {menu}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {primaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="font-bold py-3 px-6"
                    asChild
                  >
                    <a href={primaryAction.href}>
                      {primaryAction.text}
                    </a>
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="font-bold py-3 px-6"
                    asChild
                  >
                    <a href={secondaryAction.href}>
                      {secondaryAction.text}
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <BookingForm
              variant="detailed"
            />
          </div>
        </div>
      </section>
    );
  }
);
HeroSection.displayName = "HeroSection";

export { HeroSection };
