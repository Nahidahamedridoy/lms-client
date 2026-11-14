'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCapIcon,
  MenuIcon,
  XIcon,
  LockIcon,
  BookOpenIcon,
} from '@/components/ui/icons';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#14213D] via-blue-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <GraduationCapIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-[#14213D] tracking-tight leading-none">
                  DataPollex
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mb-2" />
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                  LMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 hidden sm:block">
                Modern EdTech Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              <BookOpenIcon className="w-4 h-4 text-slate-400" />
              Catalog
            </Link>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#14213D] hover:bg-[#1E2E4E] text-white shadow-sm shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LockIcon className="w-3.5 h-3.5 text-amber-400" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile: Lock icon shortcut + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin/login"
              className="p-2 text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-100"
              title="Admin Login"
            >
              <LockIcon className="w-5 h-5 text-amber-500" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/97 backdrop-blur-md px-4 pt-3 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className={`flex items-center px-3.5 py-3 rounded-xl text-base font-semibold transition-colors ${
                isActive(link.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin CTA */}
          <div className="pt-4 border-t border-slate-100 mt-2 space-y-2">
            <Link
              href="/admin/login"
              onClick={closeMobile}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[#14213D] text-white hover:bg-[#1E2E4E] transition-colors"
            >
              <LockIcon className="w-4 h-4 text-amber-400" />
              Admin Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
