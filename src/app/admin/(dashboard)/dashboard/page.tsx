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

      // Compute total lectures across all courses
      const lecturePromises = fetchedCourses.map((c) =>
        getLecturesByCourse(c._id || c.id).catch(() => [])
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
          getLecturesByCourse(c._id || c.id).catch(() => [])
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
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
              DataPollex LMS Control Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Administrator Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time synchronization with Node.js/Express backend at{' '}
            <code className="font-mono text-blue-300 font-medium">
              {API_BASE_URL}
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Manage Courses
          </Link>
        </div>
      </div>

      {error && (
        <ErrorMessage
          title="Backend Notice"
          message={error}
          onRetry={loadDashboardData}
        />
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Courses
            </p>
            <p className="text-3xl font-extrabold text-slate-900">
              {isLoading ? '...' : courses.length}
            </p>
            <p className="text-xs text-slate-400">Published in MongoDB</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpenIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Lectures
            </p>
            <p className="text-3xl font-extrabold text-slate-900">
              {isLoading ? '...' : totalLecturesCount}
            </p>
            <p className="text-xs text-slate-400">Video lectures across courses</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <VideoIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              RESTful Backend
            </p>
            <p className="text-base font-bold text-slate-800 truncate">
              {API_BASE_URL.replace('http://', '')}
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              JWT Bearer Protected
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BarChartIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Courses Quick Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Published Courses
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage courses and lectures in your backend database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              Course CRUD Page
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/lectures"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors"
            >
              Lecture CRUD Page
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-slate-100 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
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
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Course Title
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Thumbnail
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
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
                        <div className="font-semibold text-slate-900 max-w-sm truncate">
                          {course.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          ID: {id}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {course.price === 0 || !course.price
                          ? 'Free'
                          : `$${Number(course.price).toFixed(2)}`}
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-12 h-8 rounded bg-slate-100 overflow-hidden border border-slate-200">
                          {course.thumbnail ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/admin/lectures?courseId=${id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <VideoIcon className="w-3 h-3" />
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
