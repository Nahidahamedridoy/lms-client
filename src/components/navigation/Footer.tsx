import React from 'react';
import Link from 'next/link';
import {
  GraduationCapIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  GithubIcon,
  LinkedinIcon,
} from '@/components/ui/icons';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/Nahidahamedridoy',
    icon: <GithubIcon className="w-4 h-4" />,
    ariaLabel: 'View DataPollex on GitHub',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nahid-ahamed-ridoy/',
    icon: <LinkedinIcon className="w-4 h-4" />,
    ariaLabel: 'Connect on LinkedIn',
  },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#14213D] text-slate-300 border-t border-white/5 mt-auto">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Column 1: Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <GraduationCapIcon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-white tracking-tight leading-none">
                  DataPollex
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mb-2 shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  LMS
                </span>
              </div>
            </Link>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              DataPollex Ltd. provides a modern learning platform to explore courses and educational content.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.ariaLabel}
                  title={s.label}
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600/80 hover:border-blue-500/40 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-amber-400 rounded-full inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white hover:pl-1 transition-all duration-150 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-400 transition-colors duration-150"
                >
                  <LockIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Column 3: Contact ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-blue-500 rounded-full inline-block" />
              Contact
            </h4>
            <ul className="space-y-3.5">
              {/* Email */}
              <li>
                <a
                  href="mailto:nahidahamedridoy@gmail.com"
                  className="group flex items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors duration-150"
                >
                  <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600/50 transition-colors">
                    <MailIcon className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
                  </span>
                  <span className="break-all leading-snug">
                    nahidahamedridoy@gmail.com
                  </span>
                </a>
              </li>

              {/* Address */}
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon className="w-3.5 h-3.5 text-blue-400" />
                  </span>
                  <span className="leading-snug">
                    Hajjcamp, Airport,<br />
                    Dhaka, Bangladesh
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* ── Column 4: Connect ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-emerald-500 rounded-full inline-block" />
              Connect
            </h4>
            <div className="space-y-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.ariaLabel}
                  className="group flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors duration-150"
                >
                  <span className="w-8 h-8 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600/70 group-hover:border-blue-500/40 transition-all duration-200">
                    {s.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-300 group-hover:text-white text-xs leading-none mb-0.5 transition-colors">
                      {s.label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {s.label === 'GitHub' ? 'Nahidahamedridoy' : 'nahid-ahamed-ridoy'}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {year}{' '}
            <span className="text-slate-400 font-semibold">DataPollex Ltd.</span>
            {' '}All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
            <span className="text-slate-500">
              Built with Next.js · TypeScript · Node.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
