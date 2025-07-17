"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/atoms/ui/button";
import { 
  Plus, 
  Download, 
  Settings, 
  Calendar,
  Filter,
  Search
} from "lucide-react";

export function DashboardContextualNav() {
  const pathname = usePathname();

  const getContextualActions = () => {
    switch (pathname) {
      case "/dashboard":
        return [
          {
            label: "Nouveau projet",
            icon: Plus,
            href: "/dashboard/projects/new",
            variant: "default" as const
          },
          {
            label: "Voir planning", 
            icon: Calendar,
            href: "/dashboard/calendar",
            variant: "outline" as const
          }
        ];

      case "/dashboard/calendar":
        return [
          {
            label: "Nouveau RDV",
            icon: Plus,
            href: "/dashboard/calendar/new",
            variant: "default" as const
          },
          {
            label: "Filtrer",
            icon: Filter,
            href: "#",
            variant: "outline" as const
          }
        ];

      case "/dashboard/billing":
        return [
          {
            label: "Nouvelle facture",
            icon: Plus,
            href: "/dashboard/billing/new",
            variant: "default" as const
          },
          {
            label: "Exporter",
            icon: Download,
            href: "#",
            variant: "outline" as const
          }
        ];

      case "/dashboard/history":
        return [
          {
            label: "Rechercher",
            icon: Search,
            href: "#",
            variant: "outline" as const
          },
          {
            label: "Filtrer",
            icon: Filter,
            href: "#",
            variant: "outline" as const
          }
        ];

      case "/dashboard/profile":
        return [
          {
            label: "Modifier profil",
            icon: Settings,
            href: "#",
            variant: "default" as const
          }
        ];

      case "/dashboard/settings":
        return [
          {
            label: "Exporter données",
            icon: Download,
            href: "#",
            variant: "outline" as const
          }
        ];

      default:
        return [];
    }
  };

  const actions = getContextualActions();

  if (actions.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant}
          size="sm"
          className="gap-2"
          asChild={action.href !== "#"}
        >
          {action.href === "#" ? (
            <button>
              <action.icon className="h-4 w-4" />
              {action.label}
            </button>
          ) : (
            <Link href={action.href}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          )}
        </Button>
      ))}
    </div>
  );
}
