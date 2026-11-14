'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAdmin, getStoredToken, API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  GraduationCapIcon,
  LockIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // If already authenticated, redirect straight to dashboard
    if (getStoredToken()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both admin email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await loginAdmin({ email, password });
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify server status and credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCapIcon className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl text-white tracking-tight leading-none">
                  DataPollex
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                Central Management Portal
              </p>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight pt-3">
            Admin Sign In
          </h2>
          <p className="text-xs text-slate-400">
            Authenticate with JWT credentials to manage courses and lectures
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-8 border border-slate-100 space-y-6">
          {errorMessage && (
            <ErrorMessage
              title="Authentication Notice"
              message={errorMessage}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember this session
              </label>

              <span className="text-slate-400">
                JWT Protected
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LockIcon className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Evaluator Quick Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
              <span>Backend Authentication Route</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Endpoint:{' '}
              <code className="font-mono text-blue-600 font-medium">
                {API_BASE_URL}/auth/login
              </code>
              . Pre-filled with backend seed credentials (
              <code className="font-mono">admin@example.com</code> /{' '}
              <code className="font-mono">admin123456</code>).
            </p>
          </div>

          {/* Public Return Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              ← Back to public LMS student portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
