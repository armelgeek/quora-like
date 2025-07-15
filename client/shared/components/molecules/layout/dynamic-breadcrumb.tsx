'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/atoms/ui/breadcrumb';

const routeNames: Record<string, string> = {
  '/d': 'Dashboard',
  '/admin/categories': 'Catégories',
  '/admin/users': 'Utilisateurs',
  '/admin/settings': 'Paramètres',
  '/d/master/category': 'Category (Legacy)'
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  const getPageName = () => {
    return routeNames[pathname] || 'Administration';
  };

  const isAdminRoute = pathname.startsWith('/admin/');
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/d">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        {isAdminRoute && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/d">
                Administration
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{getPageName()}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
