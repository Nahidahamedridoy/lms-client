import React from 'react';
import Link from 'next/link';
import {
  GraduationCapIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  VideoIcon,
} from '@/components/ui/icons';

export const metadata = {
  title: 'Contact — DataPollex LMS',
  description:
    'Get in touch with the DataPollex LMS team. Find our official contact information and project details.',
};

const contactDetails = [
  {
    label: 'Platform',
    value: 'DataPollex Simplified LMS',
    sub: 'Learning Management System Assessment Project',
    icon: <GraduationCapIcon className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Technology Stack',
    value: 'Next.js · TypeScript · Node.js · MongoDB',
    sub: 'Full-stack RESTful architecture with JWT authentication',
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    label: 'Admin Access',
    value: 'Protected Admin Portal',
    sub: 'Manage all courses and lectures via authenticated dashboard',
    icon: <VideoIcon className="w-5 h-5" />,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Course Catalog',
    value: 'Open to All Students',
    sub: 'No sign-up required to browse and view available courses',
    icon: <BookOpenIcon className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-700',
  },
];

const faqs = [
  {
    q: 'Do I need to register to access courses?',
    a: 'No. The DataPollex LMS course catalog and lecture viewer are publicly accessible. Simply browse to the Courses page and start watching any available lecture.',
  },
  {
    q: 'How do I access the Admin Portal?',
    a: 'Navigate to Admin Portal from the navigation bar. You will be prompted to log in with administrator credentials. The backend verifies your JWT token before granting access.',
  },
  {
    q: 'What video formats are supported?',
    a: 'The platform supports YouTube embeds, Vimeo embeds, and direct HTML5-compatible video URLs (MP4). Instructors can supply any of these when creating lectures.',
  },
  {
    q: 'Who manages the course content?',
    a: 'All course and lecture creation, editing, and deletion is handled through the secured admin dashboard. Only authenticated administrators can modify the course catalog.',
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#14213D] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
              <GraduationCapIcon className="w-4 h-4" />
              Contact &amp; Information
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Get in{' '}
              <span className="text-[#F59E0B]">Touch</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Learn more about the DataPollex LMS platform, its features, and how to get started.
              Find answers to common questions below.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">

        {/* Platform Info Cards */}
        <section>
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-extrabold text-[#14213D] tracking-tight">
              Platform Information
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Key details about the DataPollex Simplified LMS system and what it provides.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {contactDetails.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {item.label}
                  </p>
                  <p className="font-bold text-[#14213D] text-sm leading-snug">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notice: Contact Information */}
        <section>
          <div className="bg-blue-50 border border-blue-200/80 rounded-3xl px-6 sm:px-10 py-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#14213D] text-base mb-1">
                  Contact Availability Notice
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  DataPollex Simplified LMS is a professional assessment project demonstrating
                  full-stack web development capabilities. Direct external contact channels (email,
                  phone, physical address) are intentionally not published at this stage. For
                  questions about access, features, or the project, please use the information below:
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>
                      <strong>Admin Portal:</strong> Navigate to{' '}
                      <Link href="/admin/login" className="text-blue-600 hover:underline font-semibold">
                        /admin/login
                      </Link>{' '}
                      and authenticate with your admin credentials.
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>
                      <strong>Course Catalog:</strong> All courses are publicly accessible via the{' '}
                      <Link href="/courses" className="text-blue-600 hover:underline font-semibold">
                        Courses
                      </Link>{' '}
                      page — no account required.
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>
                      <strong>Source Code & Documentation:</strong> Refer to the project{' '}
                      <code className="text-xs font-mono bg-blue-100/60 text-blue-800 px-1.5 py-0.5 rounded">README.md</code>{' '}
                      files in both repositories for full setup instructions and API documentation.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-extrabold text-[#14213D] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Common questions about using the DataPollex LMS platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2"
              >
                <h3 className="font-bold text-[#14213D] text-sm">
                  {item.q}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links CTA */}
        <section>
          <div className="bg-[#14213D] rounded-3xl px-8 sm:px-12 py-12 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Quick Access
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Jump directly to the section you need.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-[#14213D] font-extrabold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Course Catalog
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  About the Platform
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all"
                >
                  Admin Portal
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
