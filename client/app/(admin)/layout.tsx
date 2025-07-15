
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminLayoutClient from '@/shared/layout/admin/admin-layout-client';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage',
};

interface AdminLayoutProps {
  readonly children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  
  return (
    <AdminLayoutClient defaultOpen={defaultOpen}>
      {children}
    </AdminLayoutClient>
  );
}
