'use client';

import React from 'react';
import { format } from 'date-fns';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface Activity {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  icon?: LucideIcon;
  status?: 'success' | 'warning' | 'error' | 'info';
  user?: {
    name: string;
    avatar?: string;
  };
}

interface ActivityListProps {
  activities: Activity[];
  className?: string;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  className,
}) => {
  const getStatusColor = (status?: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-sm border p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Activités récentes
      </h3>

      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {activities.map((activity, activityIdx) => {
            const Icon = activity.icon;

            return (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}

                  <div className="relative flex items-start space-x-3">
                    {Icon ? (
                      <div className={cn(
                        'relative h-10 w-10 flex items-center justify-center rounded-full',
                        getStatusColor(activity.status)
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                    ) : activity.user?.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={activity.user.avatar}
                        alt={activity.user.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500">
                          {activity.user?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          {activity.user && (
                            <span className="font-medium text-gray-900">
                              {activity.user.name}
                            </span>
                          )}
                          <p className="mt-0.5 text-sm text-gray-500">
                            {format(activity.timestamp, 'PPp')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p className="font-medium">{activity.title}</p>
                        {activity.description && (
                          <p className="mt-1 text-gray-500">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
