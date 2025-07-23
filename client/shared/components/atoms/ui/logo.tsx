import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'compact' | 'icon-only' | 'text-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'color';
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, variant = 'default', size = 'md', theme = 'color', ...props }, ref) => {

    const textSizeClasses = {
      xs: 'text-lg',
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl'
    };

    const iconSizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };

    const themeClasses = {
      light: 'text-white',
      dark: 'text-gray-900',
      color: 'text-primary'
    };

    const LogoIcon = ({ className: iconClassName }: { className?: string }) => (
      <div className={cn(
        "relative flex items-center justify-center rounded-lg bg-white",
        iconClassName
      )}>
        {/* Q stylisé */}
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="18" fill="#310ba2" />
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="serif"
            fontWeight="bold"
            fontSize="20"
            fill="white"
          >Q</text>
          <path
            d="M28 28 L34 34"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );

    const LogoText = ({ className: textClassName }: { className?: string }) => (
      <span className={cn(
        "font-bold tracking-tight",
        textSizeClasses[size],
        theme === 'color' ? "text-[#310ba2]" : themeClasses[theme],
        textClassName
      )}>
        Quora<span className="font-normal text-gray-500">Like</span>
      </span>
    );

    const LogoTagline = () => (
      <span className={cn(
        "text-xs font-medium tracking-wide opacity-70",
        themeClasses[theme]
      )}>
        Questions & Reponses
      </span>
    );

    if (variant === 'icon-only') {
      return (
        <div ref={ref} className={cn("inline-flex", className)} {...props}>
          <LogoIcon className={iconSizeClasses[size]} />
        </div>
      );
    }

    if (variant === 'text-only') {
      return (
        <div ref={ref} className={cn("inline-flex flex-col", className)} {...props}>
          <LogoText />
          {size !== 'xs' && <LogoTagline />}
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div ref={ref} className={cn("inline-flex items-center space-x-2", className)} {...props}>
          <LogoIcon className={iconSizeClasses[size]} />
          <LogoText />
        </div>
      );
    }

    // Default variant
    return (
      <div ref={ref} className={cn("inline-flex items-center space-x-3", className)} {...props}>
        <LogoIcon className={iconSizeClasses[size]} />
        <div className="flex flex-col">
          <LogoText />
          {size !== 'xs' && <LogoTagline />}
        </div>
      </div>
    );
  }
);
Logo.displayName = "Logo";

export { Logo };
export type { LogoProps };
