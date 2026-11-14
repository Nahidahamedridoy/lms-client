'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { validateAdminSession } from '@/lib/api';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    validateAdminSession().then((valid) => {
      if (!isMounted) return;

      if (!valid) {
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        router.replace('/admin/login');
      } else {
        setIsAuthorized(true);
        setIsCheckingAuth(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  // Block rendering protected dashboard content until authorization is confirmed
  if (isCheckingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#14213D] flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-base font-bold text-slate-200">
          Verifying Admin Authorization...
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Validating JWT session with backend security
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="DataPollex LMS Administration"
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
