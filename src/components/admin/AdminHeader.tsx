'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuIcon, PlusIcon, RefreshIcon } from '@/components/ui/icons';
import { checkBackendHealth, API_BASE_URL } from '@/lib/api';

export interface AdminHeaderProps {
  title?: string;
  onOpenMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'Admin Dashboard',
  onOpenMobileMenu,
}) => {
  const [backendStatus, setBackendStatus] = useState<{
    online: boolean;
    checking: boolean;
    message: string;
  }>({
    online: false,
    checking: true,
    message: 'Checking...',
  });

  const checkStatus = () => {
    setBackendStatus((prev) => ({ ...prev, checking: true }));
    checkBackendHealth().then((status) => {
      setBackendStatus({
        online: status.online,
        checking: false,
        message: status.message,
      });
    });
  };

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((status) => {
      if (isMounted) {
        setBackendStatus({
          online: status.online,
          checking: false,
          message: status.message,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              DataPollex LMS Central Administration
            </p>
          </div>
        </div>

        {/* Right: Backend indicator & Quick Action */}
        <div className="flex items-center gap-3">
          {/* Live Backend Connection Indicator */}
          <div
            onClick={checkStatus}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
            title={`API: ${API_BASE_URL} (Click to re-check)`}
          >
            <span className="relative flex h-2 w-2">
              {backendStatus.online ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              )}
            </span>
            <span className="text-slate-700 font-medium hidden md:inline">
              Backend:{' '}
              <span
                className={
                  backendStatus.online ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'
                }
              >
                {backendStatus.checking
                  ? 'Connecting...'
                  : backendStatus.online
                  ? 'Online (5000)'
                  : 'Offline (localhost:5000)'}
              </span>
            </span>
            <RefreshIcon
              className={`w-3 h-3 text-slate-400 ${
                backendStatus.checking ? 'animate-spin' : ''
              }`}
            />
          </div>

          {/* Quick Action: New Course Button */}
          <Link
            href="/admin/courses?action=new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Course</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
