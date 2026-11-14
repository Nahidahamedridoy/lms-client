'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { getCourses, API_BASE_URL } from '@/lib/api';
import { CourseCard } from '@/components/ui/CourseCard';
import { CourseCardSkeleton } from '@/components/ui/CourseSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  ArrowRightIcon,
  SparklesIcon,
  GraduationCapIcon,
  LayersIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  LockIcon,
  VideoIcon,
  CheckCircleIcon,
  StarIcon,
} from '@/components/ui/icons';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data.slice(0, 3));
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load courses from backend API';
      setError(message);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data.slice(0, 3));
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to load courses from backend API';
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#14213D] text-white pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[550px] sm:h-[550px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Action CTAs */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Top Tag Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-blue-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
                <SparklesIcon className="w-4 h-4 text-amber-400" />
                <span>DataPollex EdTech Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Advance Your Career with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                  Expert-Led
                </span>{' '}
                Technical Learning
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Structured video courses and verified curriculum designed for
                modern engineers. Explore public lectures or sign into the admin
                suite to manage course content.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Explore All Courses
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>

                <Link
                  href="/admin/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LockIcon className="w-4 h-4 text-amber-400" />
                  Admin Portal
                </Link>
              </div>

              {/* Metrics Pill Grid */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400 font-medium">Data Integrity</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Live MongoDB
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400 font-medium">Video Player</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1.5">
                    <VideoIcon className="w-3.5 h-3.5" />
                    HD Streaming
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-400 font-medium">Security</div>
                  <div className="text-sm font-bold text-blue-300 mt-0.5">
                    JWT Protected
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Attractive EdTech SaaS Hero Visual */}
            <div className="lg:col-span-5 relative">
              {/* Background Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse" />

              {/* Platform Mockup Window */}
              <div className="relative rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4">
                {/* Header Window Buttons */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    DataPollex Live Classroom
                  </span>
                </div>

                {/* Simulated Video Player Screen */}
                <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-br from-[#14213D] to-slate-900 border border-slate-700/60 flex flex-col justify-between p-4 overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Lesson 01
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded">
                      1080p HD
                    </span>
                  </div>

                  {/* Play Button Icon */}
                  <div className="mx-auto my-auto w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 transition-transform cursor-pointer">
                    <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>

                  {/* Scrubber / Waveform Bar */}
                  <div className="space-y-1.5 z-10">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>14:20</span>
                      <span>38:45</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-2/5 h-full bg-gradient-to-r from-blue-500 to-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Simulated Lecture Details Strip */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">Full-Stack Cloud Architecture</p>
                    <p className="text-[11px] text-slate-400">Instructor: Senior Systems Specialist</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">5.0</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge Bottom Left */}
              <div className="hidden sm:flex absolute -bottom-4 -left-4 items-center gap-2.5 p-3 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Verified Curriculum</div>
                  <div className="text-[10px] text-slate-500">Live Video Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Featured Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Programs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select any course to view full curriculum and watch lessons
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors self-start sm:self-auto"
          >
            <span>View Full Catalog</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic State Handling for Courses */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <ErrorMessage
              title="Backend Server Offline"
              message={error}
              onRetry={fetchCourses}
            />
            <div className="p-4 rounded-2xl bg-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Backend API Notice:</p>
              <p>
                Courses are fetched directly from{' '}
                <code className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-slate-800">
                  {API_BASE_URL}/courses
                </code>
                . Please ensure the Express server is running on port 5000.
              </p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            title="No Courses Published Yet"
            description={`Course records are served live from your Express backend at ${API_BASE_URL}/courses. Log in as an administrator to create courses and lectures.`}
            actionText="Go to Admin Portal"
            actionHref="/admin/login"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Clean Benefits / Platform Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Tech Education
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            DataPollex LMS combines an elegant student viewing experience with
            powerful, secured administrator controls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
              <VideoIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              HD Video Lectures
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Responsive video playback supporting YouTube, Vimeo, and direct MP4
              streams with playlist tracking.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#14213D]/5 text-[#14213D] flex items-center justify-center mb-5 border border-[#14213D]/10">
              <LayersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Course Hierarchy
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Curriculums neatly structured into courses and ordered lectures for
              smooth and logical student learning paths.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-100">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Protected Admin CMS
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Secure JWT Bearer authentication powering full Course and Lecture
              CRUD operations with route guards.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
              <GraduationCapIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Live Database Sync
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Direct connection to MongoDB Atlas with zero mock data and decoupled
              Express REST API architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#14213D] via-blue-900 to-[#14213D] text-white p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-xl shadow-slate-900/10 border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Access Curriculum</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Start Learning Today?
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Browse our full catalog of technical courses or sign in as an
            administrator to create new learning paths.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse All Courses
            </Link>

            <Link
              href="/admin/login"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Admin Management Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
