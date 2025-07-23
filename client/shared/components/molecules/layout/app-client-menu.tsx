"use client";

import { NavLink } from "@/shared/components/atoms/ui/navigation";
import { Button } from "@/shared/components/atoms/ui/button";
import { useAuth } from "@/shared/providers/auth-provider";
import Link from "next/link";
import { useActivePath } from "./use-active-path";
import { authClient } from "@/shared/lib/config/auth-client";
import { CLIENT_MENU_ITEMS } from "@/shared/lib/constants/app.constant";
import { Icons } from "@/shared/components/atoms/ui/icons";
import { Logo } from "@/shared/components/atoms/ui/logo";
import { useState } from "react";

const AppClientMenu = () => {
  const { isLoading } = useAuth();
  const { data } = authClient.useSession();
  const session = data?.session;
  const pathname = useActivePath();
  const [mobileOpen, setMobileOpen] = useState(false);

  const ctaButton = () => {
    if (isLoading) {
      return <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />;
    }
    
    if (session) {
      return (
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
          <Link href="/dashboard">Tableau de bord</Link>
        </Button>
      );
    }
    
    return (
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
        <Link href="/register">S'inscrire</Link>
      </Button>
    );
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 px-4 h-14 flex items-center justify-between max-w-6xl mx-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center" aria-label="Accueil">
        <Logo size="md" variant="compact" />
      </Link>

      {/* Menu principal - Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        {CLIENT_MENU_ITEMS.map((item) => {
          const Icon = item.icon ? Icons[item.icon] : null;
          const isActive = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
          
          return (
            <NavLink
              key={item.url}
              href={item.url}
              className={`text-sm font-medium px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
              }`}
              aria-label={item.title}
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.title}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Actions - Desktop */}
      <div className="hidden md:flex items-center gap-3">
        <Button asChild variant="outline" className="text-sm px-3 py-2 border-gray-300">
          <Link href="/question/create">Poser une question</Link>
        </Button>
        {ctaButton()}
      </div>

      {/* Menu mobile */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Logo size="sm" variant="compact" />
                <button
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {CLIENT_MENU_ITEMS.map((item) => {
                const isActive = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                
                return (
                  <div key={item.url} onClick={() => setMobileOpen(false)}>
                    <NavLink
                      href={item.url}
                      className={`block w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-gray-100 ${
                        isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      {item.title}
                    </NavLink>
                  </div>
                );
              })}
              
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <Button asChild variant="outline" className="w-full text-sm">
                  <Link href="/question/create">Poser une question</Link>
                </Button>
                <div className="w-full">{ctaButton()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppClientMenu;