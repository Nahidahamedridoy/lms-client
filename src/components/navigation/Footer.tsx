import React from 'react';
import Link from 'next/link';
import { GraduationCapIcon, LockIcon } from '@/components/ui/icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCapIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                DataPollex Ltd.
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              DataPollex Simplified LMS provides streamlined, enterprise-ready digital learning solutions for professionals and institutions. Built with Next.js, TypeScript, and Express.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span>Next.js App Router</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Express API</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <LockIcon className="w-3.5 h-3.5" />
                  Admin Sign In
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Backend Connection Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Backend Integration
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-medium">API Endpoint</span>
                <span className="font-mono text-[11px] text-blue-400">localhost:5000</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Course listings, details, and authentication are dynamically wired to your Node.js backend.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DataPollex Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Simplified LMS Recruitment Assessment</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
