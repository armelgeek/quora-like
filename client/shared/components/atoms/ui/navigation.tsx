import * as React from 'react';
import Link from "next/link";
import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import { Logo } from './logo';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, active = false, className, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          "py-2 transition-colors duration-200 hover:text-primary",
          active && "border-b-2 border-primary text-primary font-bold",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
NavLink.displayName = "NavLink";

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  children?: React.ReactNode;
  ctaButton?: React.ReactNode;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ className, logo, children, ctaButton, mobileMenuOpen = false, onMobileMenuToggle, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("bg-white shadow-md sticky top-0 z-50", className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {logo || <Logo variant="compact" size="md" />}
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-8">
                  {children}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {ctaButton || (
                <Button variant="primary" className="font-bold">
                  Réserver maintenant
                </Button>
              )}
              <button 
                className="md:hidden p-2 rounded-full text-primary hover:bg-gray-100 focus:outline-none"
                onClick={onMobileMenuToggle}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={cn("md:hidden", !mobileMenuOpen && "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {children}
          </div>
        </div>
      </nav>
    );
  }
);
Navigation.displayName = "Navigation";

export { Navigation, NavLink };
