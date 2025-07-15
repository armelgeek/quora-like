'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/atoms/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/shared/components/atoms/ui/collapsible';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/shared/components/atoms/ui/sidebar';
import {
  ChevronRight,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '@/shared/components/atoms/ui/icons';
import { authClient } from '@/shared/lib/config/auth-client';
import { getSidebarNavItems } from '@/shared/lib/constants/app.constant';
import { Button } from '@/shared/components/atoms/ui/button';
import { Logo } from '@/shared/components/atoms/ui/logo';
import { cn } from '@/shared/lib/utils';

export default function AppSidebar({ session }: { session: { user?: { name?: string; email?: string; image?: string | null } } | null }) {
  const router = useRouter();
  const navItems = getSidebarNavItems();
  const pathname = usePathname();

  // Marquer actif si l'URL commence par l'item (pour /admin/trips et /admin/trips/[id]/seats)
  const isActive = (url: string) => {
    if (url === '/') return pathname === '/';
    return pathname === url || pathname.startsWith(url + '/') || (url !== '/' && pathname.startsWith(url));
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/login') },
    });
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white" collapsible='icon'>
      <SidebarHeader className="border-b border-gray-200 p-3">
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
              {navItems.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : undefined;
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isActive(item.url)}
                    className='group/collapsible'
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive(item.url)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all",
                            "hover:bg-gray-100 hover:text-primary",
                            "data-[state=active]:bg-primary data-[state=active]:text-white",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            {item.icon && Icon && <Icon className="w-5 h-5" />}
                            {item.label && <span className="text-lg">{item.label}</span>}
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight className='ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive(item.url)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        "hover:bg-gray-100 hover:text-primary",
                        "data-[state=active]:bg-primary data-[state=active]:text-white",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      )}
                    >
                      <Link href={item.url}>
                        <div className="flex items-center space-x-3">
                          {item.icon && Icon && <Icon className="w-5 h-5" />}
                          {item.label && <span className="text-lg">{item.label}</span>}
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage 
              src={session?.user?.image || ''} 
              alt={session?.user?.name || ''} 
            />
            <AvatarFallback className="bg-primary text-white">
              {session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email || ''}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-gray-500 hover:text-primary hover:bg-gray-100"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
