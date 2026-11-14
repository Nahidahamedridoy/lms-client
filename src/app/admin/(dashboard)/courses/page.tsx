'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { getAdminCourses, API_BASE_URL } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  RefreshIcon,
  SearchIcon,
  ArrowRightIcon,
} from '@/components/ui/icons';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminCourses();
      setCourses(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch admin courses';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getAdminCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to fetch admin courses';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Course Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, view, and manage curriculum synchronized with {API_BASE_URL}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCourses}
            isLoading={isLoading}
            leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          title="Course Data Synchronization"
          message={error}
          onRetry={fetchCourses}
        />
      )}

      {/* Filter / Search header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by name or category..."
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500">
          Total published: <strong>{filteredCourses.length}</strong>
        </div>
      </div>

      {/* Courses Table / Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={search ? 'No Matches Found' : 'No Courses Created Yet'}
              description={
                search
                  ? `No course matching "${search}". Try clearing search.`
                  : `Your backend currently has no courses stored. All courses shown here are retrieved directly from ${API_BASE_URL}/courses.`
              }
              actionText={search ? 'Clear Search' : 'Go to Public Catalog'}
              onAction={search ? () => setSearch('') : undefined}
              actionHref={!search ? '/courses' : undefined}
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
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCourses.map((course) => {
                  const id = course.id || course._id;
                  return (
                    <tr key={id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {course.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          ID: {id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="blue" size="sm">
                          {course.category || 'General'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-700">
                        {course.level || 'All Levels'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {course.price === 0 || !course.price
                          ? 'Free'
                          : `$${course.price.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/courses/${id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View Live
                          <ArrowRightIcon className="w-3 h-3" />
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
