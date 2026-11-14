'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { getCourses, getLecturesByCourse, API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  BookOpenIcon,
  VideoIcon,
  PlusIcon,
  RefreshIcon,
  ArrowRightIcon,
  BarChartIcon,
} from '@/components/ui/icons';

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalLecturesCount, setTotalLecturesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);

      const lecturePromises = fetchedCourses.map((c) =>
        getLecturesByCourse(c._id || c.id || '').catch(() => [])
      );
      const allLecturesArrays = await Promise.all(lecturePromises);
      const totalCount = allLecturesArrays.reduce(
        (acc, curr) => acc + curr.length,
        0
      );
      setTotalLecturesCount(totalCount);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to retrieve dashboard data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getCourses()
      .then(async (fetchedCourses) => {
        if (!isMounted) return;
        setCourses(fetchedCourses);

        const lecturePromises = fetchedCourses.map((c) =>
          getLecturesByCourse(c._id || c.id || '').catch(() => [])
        );
        const allLecturesArrays = await Promise.all(lecturePromises);
        if (isMounted) {
          const totalCount = allLecturesArrays.reduce(
            (acc, curr) => acc + curr.length,
            0
          );
          setTotalLecturesCount(totalCount);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to retrieve dashboard data';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#14213D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
              DataPollex Management Suite
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Administrator Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time synchronization with Node.js/Express backend at{' '}
            <code className="font-mono text-blue-300 font-semibold">
              {API_BASE_URL}
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadDashboardData}
            isLoading={isLoading}
            leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
          >
            Refresh Data
          </Button>

          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusIcon className="w-4 h-4" />
            Manage Courses
          </Link>
        </div>

        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {error && (
        <ErrorMessage
          title="Backend Notice"
          message={error}
          onRetry={loadDashboardData}
        />
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        {/* Total Courses */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-blue-300 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Courses
            </p>
            <p className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : courses.length}
            </p>
            <p className="text-xs text-slate-400 font-medium">Published in MongoDB</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <BookOpenIcon className="w-7 h-7" />
          </div>
        </div>

        {/* Total Lectures */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-amber-300 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Lectures
            </p>
            <p className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : totalLecturesCount}
            </p>
            <p className="text-xs text-slate-400 font-medium">Active video streaming lessons</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <VideoIcon className="w-7 h-7" />
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-emerald-300 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              RESTful Backend
            </p>
            <p className="text-base font-bold text-slate-900 truncate">
              {API_BASE_URL.replace('http://', '')}
            </p>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              JWT Bearer Guarded
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <BarChartIcon className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Courses Summary Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Published Courses
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of active learning tracks in the backend database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 px-3.5 py-2 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              Courses CRUD
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/lectures"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Lectures CRUD
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-slate-100 rounded-xl w-1/4 animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Courses in Database"
              description={`The backend API at ${API_BASE_URL}/courses returned an empty list. Create your first course to begin adding lectures.`}
              actionText="Add Course"
              actionHref="/admin/courses"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Course Title
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Thumbnail
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {courses.map((course) => {
                  const id = course._id || course.id;
                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 max-w-sm truncate">
                          {course.title}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">
                          ID: {id}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900">
                        {course.price === 0 || !course.price
                          ? 'Free'
                          : `$${Number(course.price).toFixed(2)}`}
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-14 h-9 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                          {course.thumbnail ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpenIcon className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/admin/lectures?courseId=${id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <VideoIcon className="w-3.5 h-3.5" />
                          Lectures
                        </Link>
                        <Link
                          href={`/courses/${id}`}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1"
                        >
                          View Live
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
