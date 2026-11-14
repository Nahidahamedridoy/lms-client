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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-medium backdrop-blur-md">
            <SparklesIcon className="w-4 h-4 text-blue-400" />
            <span>DataPollex Simplified LMS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            Master In-Demand Skills with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Interactive
            </span>{' '}
            Lectures
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Browse structured courses, watch video lectures, and track your
            progress seamlessly. Powered directly by our Node.js and Express
            API.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpenIcon className="w-4 h-4" />
              Browse Courses
              <ArrowRightIcon className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-colors"
            >
              <LockIcon className="w-4 h-4 text-slate-400" />
              Admin Management
            </Link>
          </div>

          <div className="pt-8 border-t border-slate-800/80 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-400 font-medium">Architecture</p>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">Next.js 16</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Backend API</p>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">Express + Mongo</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Data Integrity</p>
              <p className="text-sm font-semibold text-emerald-400 mt-0.5">Live Database</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Video Player</p>
              <p className="text-sm font-semibold text-blue-400 mt-0.5">Public Lectures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              <BookOpenIcon className="w-4 h-4" />
              Featured Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Courses
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore available courses and their lectures
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start sm:self-auto"
          >
            View All Courses
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic State Handling for Courses */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Backend API Notice:</p>
              <p>
                Courses are fetched directly from{' '}
                <code className="px-1 py-0.5 bg-slate-200 rounded font-mono text-slate-800">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive LMS Foundation
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built strictly to specification with decoupled architecture and zero mock data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <LayersIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Course & Lecture Hierarchy
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every course contains dedicated video lectures stored in MongoDB and
              accessible for instant streaming.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Protected Admin Operations
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              JWT Bearer authentication secures administrative routes for full CRUD
              control over courses and lecture content.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <GraduationCapIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Public Lecture Player
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Open public lecture player supports responsive video playback and
              smooth curriculum navigation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
