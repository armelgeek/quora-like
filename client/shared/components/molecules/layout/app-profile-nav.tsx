"use client";
import React from 'react';
import {
  User,
  Trash,
  LogOut,
  Key
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const NavItem = ({ href, icon, children, active, className = '' }: { href: string; icon: string; children: ReactNode; active: boolean; className?: string }) => {
  const baseClasses = "flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 rounded-md";
  const activeClasses = active ? "bg-gray-200 text-gray-800" : "";
  return (
    <li>
      <Link
        href={href}
        className={`${baseClasses} ${activeClasses} ${className}`}
      >
        <span className="w-5 h-5 mr-2">
          {getIcon(icon)}
        </span>
        {children}
      </Link>
    </li>
  );
};

const getIcon = (name: string) => {
  const icons = {
    user: <User size={18} />,
    password: <Key size={18} />,
    trash: <Trash size={18} />,
    logout: <LogOut size={18} />
  };

  return icons[name as keyof typeof icons] || null;
};
const AppProfileNav = () => {
  const pathname = usePathname();
  return (<div>
    <ul className='flex flex-col space-y-2'>
      <NavItem href="/account" icon="user" active={pathname === '/account'}>
        Edit profile
      </NavItem>
      <NavItem href="/account/update-password" icon="password" active={pathname === '/account/update-password'}>
        Update password
      </NavItem>
      <NavItem href="/account/delete-account" icon="trash" active={pathname === '/account/delete-account'}>
        Delete profile
      </NavItem>
    </ul>
  </div>);
};

export default AppProfileNav;