import React from 'react';
import '@/shared/styles/globals.css';
import { Footer } from '@/shared/components/atoms/ui/footer';
import AppClientMenu from '@/shared/components/molecules/layout/app-client-menu';

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default async function BaseLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <AppClientMenu />
      <main className="max-w-screen-2xl lg:px-40 xl:px-40 min-h-screen">
        {children}
      </main>
      <Footer variant="detailed" />
    </div>
  );
}
