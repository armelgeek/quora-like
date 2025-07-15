"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/components/atoms/ui/breadcrumb";
import { getAdminBreadcrumbConfig } from '@/shared/lib/admin/admin-generator';

export function AdminBreadcrumb() {
	const pathname = usePathname();
	if (pathname === '/admin') return null;

	const breadcrumbs = getAdminBreadcrumbConfig(pathname);

	return (
		<div>
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
											{breadcrumb.emoji && <span className="text-lg">{breadcrumb.emoji}</span>}
											{Icon && <Icon className="w-4 h-4" />}
											{breadcrumb.label}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink
											asChild
											className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
										>
											<Link href={breadcrumb.href!}>
												{breadcrumb.emoji && <span className="text-lg">{breadcrumb.emoji}</span>}
												{Icon && <Icon className="w-4 h-4" />}
												{breadcrumb.label}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{!isLast && (
									<BreadcrumbSeparator />
								)}
							</div>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
