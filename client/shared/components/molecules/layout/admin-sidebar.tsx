"use client";

import { cn } from "@/shared/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/atoms/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/atoms/ui/avatar";
import { Button } from "@/shared/components/atoms/ui/button";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { Logo } from "@/shared/components/atoms/ui/logo";
import { LogOut } from "lucide-react";
import * as React from "react";

export interface AdminSidebarMenuItem {
  title: string;
  icon: React.ElementType;
  url: string;
  badge?: string | null;
}

export interface AdminSidebarProps {
  menuItems: AdminSidebarMenuItem[];
  user?: {
    name?: string;
    email?: string;
    image?: string | null;
  };
  onLogout?: () => void;
  className?: string;
}

export function AdminSidebar({ menuItems, user, onLogout, className }: AdminSidebarProps) {
  return (
    <Sidebar className={cn("border-r border-gray-200 bg-white", className)}>
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <Logo variant="compact" size="md" />
          <div>
            <p className="text-sm text-gray-500">Administration</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all",
                      "hover:bg-gray-100 hover:text-primary",
                      "data-[state=open]:bg-primary data-[state=open]:text-white",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-primary text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.image || "/api/placeholder/40/40"} alt={user?.name || "Admin"} />
            <AvatarFallback className="bg-primary text-white">
              {user?.name?.slice(0, 2).toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "Admin Boiler"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "admin@Boiler-transport.com"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-500 hover:text-primary hover:bg-gray-100"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
