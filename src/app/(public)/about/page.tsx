import React from 'react';
import Link from 'next/link';
import {
  GraduationCapIcon,
  BookOpenIcon,
  VideoIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LayersIcon,
  StarIcon,
  UsersIcon,
} from '@/components/ui/icons';

export const metadata = {
  title: 'About — DataPollex LMS',
  description:
    'Learn about DataPollex Simplified LMS — a modern, professional learning management system built for accessible, high-quality online education.',
};

const highlights = [
  {
    icon: <BookOpenIcon className="w-6 h-6" />,
    title: 'Structured Curriculum',
    description:
      'Courses are carefully organized into sequenced lectures, ensuring a progressive and coherent learning path from fundamentals to advanced topics.',
  },
  {
    icon: <VideoIcon className="w-6 h-6" />,
    title: 'Video-First Learning',
    description:
      'Each lecture is delivered through an embedded video player supporting YouTube, Vimeo, and direct MP4 streams — optimized for any device and connection.',
  },
  {
    icon: <LayersIcon className="w-6 h-6" />,
    title: 'Multi-Course Catalog',
    description:
      'Students can browse a growing catalog of professional courses spanning software development, data science, and digital skills.',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: 'Secure Administration',
    description:
      'All course and lecture management is handled through a fully authenticated admin portal protected by JWT-based backend authentication.',
  },
];

const values = [
  'Accessible education for every professional level',
  'Real-world, industry-relevant curriculum',
  'Clean, distraction-free learning environment',
  'Transparent course pricing with no hidden fees',
  'Continuously updated lecture libraries',
  'Secure, privacy-respecting platform design',
];

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#14213D] relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
              <GraduationCapIcon className="w-4 h-4" />
              About DataPollex LMS
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              A Modern Platform for{' '}
              <span className="text-[#F59E0B]">Professional Learning</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              DataPollex Simplified LMS is a professional learning management system designed to
              deliver high-quality video-based education in a clean, accessible environment — built
              to connect instructors and learners without complexity.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-[#14213D] text-sm font-extrabold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25"
              >
                Browse Courses
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <StarIcon className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] leading-tight tracking-tight">
              Education That Respects Your Time
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              The DataPollex LMS was built around a simple belief: learning should be direct,
              well-organized, and free of unnecessary friction. We focus exclusively on delivering
              structured, video-led courses that learners can follow at their own pace — without
              mandatory sign-ups, ads, or disruptive paywalls blocking core content.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Our administrative platform empowers educators to create, update, and publish courses
              and lectures in real time, with all content synchronized instantly to the student-facing
              portal through our RESTful backend API.
            </p>
          </div>

          {/* Values list */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <UsersIcon className="w-4 h-4" />
              Core Commitments
            </div>
            <ul className="space-y-3">
              {values.map((val) => (
                <li key={val} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-snug">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <LayersIcon className="w-4 h-4" />
              Platform Overview
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
              Everything Students Need to Succeed
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              A focused feature set designed around the learning journey — from course discovery
              to lecture playback.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-6 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#14213D] text-base">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-[#14213D] rounded-3xl px-8 sm:px-12 py-12 sm:py-14 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Start Learning?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
              Explore the full course catalog and begin your professional development journey today.
              No registration required to browse.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-[#14213D] font-extrabold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25"
              >
                View All Courses
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
