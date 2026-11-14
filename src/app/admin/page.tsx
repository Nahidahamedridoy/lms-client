'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateAdminSession } from '@/lib/api';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    validateAdminSession().then((isValid) => {
      if (!isMounted) return;

      if (isValid) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-300">
        Verifying administrator session...
      </p>
    </div>
  );
}
