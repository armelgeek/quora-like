"use client";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/shared/components/atoms/ui/sidebar';
import { Badge } from '@/shared/components/atoms/ui/badge';
import { cn } from '@/shared/lib/utils';
import * as React from 'react';

export interface AdminSidebarMenuItemProps {
  title: string;
  icon: React.ElementType;
  url: string;
  badge?: string | null;
}

export interface AdminSidebarMenuProps {
  items: AdminSidebarMenuItemProps[];
  className?: string;
}

export function AdminSidebarMenu({ items, className }: AdminSidebarMenuProps) {
  return (
    <SidebarMenu className={cn('space-y-1', className)}>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all',
              'hover:bg-gray-100 hover:text-primary',
              'data-[state=open]:bg-primary data-[state=open]:text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
            asChild
          >
            <a href={item.url} className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="bg-primary text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
