import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface ServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor?: string;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, icon, title, description, iconColor = "text-primary", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "service-card bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 p-6 border border-gray-100 hover:transform hover:translate-y-[-5px] hover:shadow-xl",
          className
        )}
        {...props}
      >
        <div className={cn("text-4xl mb-4", iconColor)}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }
);
ServiceCard.displayName = "ServiceCard";

export { ServiceCard };
