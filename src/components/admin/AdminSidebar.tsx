'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCapIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  VideoIcon,
  LogOutIcon,
  ArrowRightIcon,
  XIcon,
} from '@/components/ui/icons';
import { clearStoredAuth, getStoredAdmin } from '@/lib/api';

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const admin = getStoredAdmin();

  const handleLogout = () => {
    clearStoredAuth();
    router.push('/admin/login');
  };

  const navItems = [
    {
      label: 'Overview',
      href: '/admin/dashboard',
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
      active: pathname === '/admin' || pathname === '/admin/dashboard',
    },
    {
      label: 'Courses',
      href: '/admin/courses',
      icon: <BookOpenIcon className="w-5 h-5" />,
      active: pathname.startsWith('/admin/courses'),
    },
    {
      label: 'Lectures',
      href: '/admin/lectures',
      icon: <VideoIcon className="w-5 h-5" />,
      active: pathname.startsWith('/admin/lectures'),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#14213D] text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <GraduationCapIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight leading-none">
                DataPollex
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Management Suite</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Management
        </div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              item.active
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={item.active ? 'text-white' : 'text-slate-400'}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Quick Links
        </div>
        <Link
          href="/"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-3">
            <GraduationCapIcon className="w-5 h-5 text-slate-400" />
            Public Student Site
          </span>
          <ArrowRightIcon className="w-4 h-4 text-slate-500" />
        </Link>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-[#0f172a]/80">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {admin?.username ? admin.username.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {admin?.username || 'Administrator'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {admin?.email || 'admin@example.com'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-900/30 cursor-pointer"
        >
          <LogOutIcon className="w-3.5 h-3.5" />
          Sign Out of Admin
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 border-r border-slate-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
