import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-semibold shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        accent: 'border-transparent bg-accent text-accent-foreground',
        muted: 'border-transparent bg-muted text-muted-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'bg-background border-border text-foreground',
        plain: 'inline-flex items-center justify-center rounded-full border px-1.5 text-xs font-medium leading-normal transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-foreground',
      },
      shadow: {
        true: 'shadow-md',
        false: '',
      },
      animate: {
        true: 'animate-fade-in',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      shadow: true,
      animate: false,
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shadow, animate, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, shadow, animate }), className)}
      tabIndex={0}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
