'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types';
import { getCourses, API_BASE_URL } from '@/lib/api';
import { CourseCard } from '@/components/ui/CourseCard';
import { CourseListSkeleton } from '@/components/ui/CourseSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import {
  SearchIcon,
  BookOpenIcon,
  RefreshIcon,
  XIcon,
} from '@/components/ui/icons';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCourseList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to fetch courses from backend API';
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
          setCourses(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to fetch courses from backend API';
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (course.title || '').toLowerCase().includes(query) ||
      (course.description || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="bg-[#14213D] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <BookOpenIcon className="w-4 h-4" />
            Curriculum Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Explore All Courses
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Gain verified professional skills. All courses and their video lectures
            are served live from the Express backend API.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title, keywords or topic..."
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="text-xs font-medium text-slate-500">
              {isLoading
                ? 'Fetching courses...'
                : `Showing ${filteredCourses.length} of ${courses.length} course${
                    courses.length === 1 ? '' : 's'
                  }`}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchCourseList}
              isLoading={isLoading}
              leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <CourseListSkeleton count={6} />
      ) : error ? (
        <div className="space-y-4">
          <ErrorMessage
            title="Backend Connection Failed"
            message={error}
            onRetry={fetchCourseList}
          />
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Server Note:</strong> No mock courses are injected. Please verify your Express backend is running on{' '}
            <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-semibold">
              {API_BASE_URL}
            </code>.
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No Matching Courses Found' : 'No Courses Available'}
          description={
            searchQuery
              ? `No courses match "${searchQuery}". Try a different keyword.`
              : `Your Node.js/Express backend at ${API_BASE_URL}/courses has zero course entries. An administrator can create courses from the Admin dashboard.`
          }
          actionText={searchQuery ? 'Clear Search' : 'Go to Admin Portal'}
          onAction={searchQuery ? () => setSearchQuery('') : undefined}
          actionHref={!searchQuery ? '/admin/login' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
