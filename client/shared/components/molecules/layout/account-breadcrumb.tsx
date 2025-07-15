"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, User, Settings, Key, Trash2 } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/atoms/ui/breadcrumb";

interface BreadcrumbConfig {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const getBreadcrumbConfig = (pathname: string): BreadcrumbConfig[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbConfig[] = [
    { label: 'Accueil', href: '/', icon: Home }
  ];

  if (segments.includes('account')) {
    breadcrumbs.push({ label: 'Mon Compte', href: '/account', icon: User });
    
    if (pathname === '/account/update-password') {
      breadcrumbs.push({ label: 'Changer le mot de passe', icon: Key });
    } else if (pathname === '/account/delete-account') {
      breadcrumbs.push({ label: 'Supprimer le compte', icon: Trash2 });
    } else if (pathname === '/account') {
      breadcrumbs.push({ label: 'Paramètres du profil', icon: Settings });
    }
  }

  return breadcrumbs;
};

export function AccountBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbConfig(pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const Icon = breadcrumb.icon;

            return (
              <div key={breadcrumb.label + '-' + index} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-2 font-medium text-foreground">
                      {Icon && <Icon className="w-4 h-4" />}
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      asChild
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Link href={breadcrumb.href!}>
                        {Icon && <Icon className="w-4 h-4" />}
                        {breadcrumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4" />
                  </BreadcrumbSeparator>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
