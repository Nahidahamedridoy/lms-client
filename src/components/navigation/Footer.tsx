import React from 'react';
import Link from 'next/link';
import { GraduationCapIcon, LockIcon } from '@/components/ui/icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14213D] text-slate-300 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCapIcon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-white tracking-tight">
                  DataPollex
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-2" />
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  LMS
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              DataPollex Simplified LMS provides streamlined, enterprise-ready digital learning solutions. Built with Next.js, TypeScript, and Node.js REST API.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Next.js App Router
              </span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Express API</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-amber-500 rounded-full" />
              Navigation
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
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <LockIcon className="w-3.5 h-3.5 text-amber-500" />
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

          {/* Backend Info Card */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-blue-500 rounded-full" />
              API Connectivity
            </h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2.5 backdrop-blur-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-slate-200">API Endpoint</span>
                <span className="font-mono text-[11px] text-amber-400 font-medium">localhost:5000</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Courses, lectures, and JWT authentication communicate directly with your Node.js backend.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DataPollex Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Simplified LMS Recruitment Project</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">EdTech SaaS Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
