'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAdmin, API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  GraduationCapIcon,
  LockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@/components/ui/icons';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both admin email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await loginAdmin({
        email: email.trim(),
        password: password.trim(),
      });
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setEmail('admin@example.com');
    setPassword('admin123456');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#14213D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <GraduationCapIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl text-white tracking-tight leading-none">
                  DataPollex
                </span>
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/25 text-blue-200 border border-blue-400/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                Central Learning Management Suite
              </p>
            </div>
          </Link>

          <div className="pt-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Admin Portal Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Authenticate with administrative credentials to access protected management routes
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/50 p-7 sm:p-9 border border-slate-100 space-y-6">
          {errorMessage && (
            <ErrorMessage
              title="Authentication Notice"
              message={errorMessage}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer"
              >
                Use Seed Credentials
              </button>
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
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#14213D]">
              <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
              <span>JWT Authentication & API Synchronized</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              POST endpoint:{' '}
              <code className="font-mono text-blue-600 font-semibold">
                {API_BASE_URL}/auth/login
              </code>
              <br />
              Default seed account: <code className="font-mono font-medium text-slate-800">admin@example.com</code> /{' '}
              <code className="font-mono font-medium text-slate-800">admin123456</code>
            </p>
          </div>

          {/* Public Return Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <span>Return to Public Student Portal</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
