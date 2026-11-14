'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Course, CourseFormData } from '@/types';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  API_BASE_URL,
} from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  BookOpenIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  ArrowRightIcon,
  VideoIcon,
  XIcon,
} from '@/components/ui/icons';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
  });

  const fetchCourseData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch courses from backend';
      setError(msg);
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
          const msg =
            err instanceof Error ? err.message : 'Failed to fetch courses from backend';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      thumbnail: '',
    });
    setModalError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
    });
    setModalError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.thumbnail) {
      setModalError('All fields (Title, Description, Price, Thumbnail) are required.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      const newCourse = await createCourse(formData);
      setCourses((prev) => [newCourse, ...prev]);
      setIsCreateOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create course';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    const courseId = editingCourse._id || editingCourse.id;
    if (!courseId) return;

    setIsSubmitting(true);
    setModalError(null);
    try {
      const updated = await updateCourse(courseId, formData);
      setCourses((prev) =>
        prev.map((c) => ((c._id || c.id) === courseId ? updated : c))
      );
      setEditingCourse(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update course';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return;
    const courseId = deletingCourse._id || deletingCourse.id;
    if (!courseId) return;

    setIsSubmitting(true);
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => (c._id || c.id) !== courseId));
      setDeletingCourse(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete course';
      alert(`Delete Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Course Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full CRUD management for LMS courses synchronized with {API_BASE_URL}/courses
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCourseData}
            isLoading={isLoading}
            leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Add New Course
          </Button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          title="Backend Notice"
          message={error}
          onRetry={fetchCourseData}
        />
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredCourses.length}</strong> of{' '}
          <strong>{courses.length}</strong> courses
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
                  ? `No course matches "${search}".`
                  : `There are currently no courses in the database. Use "+ Add New Course" to create the first course.`
              }
              actionText={search ? 'Clear Search' : 'Create Course'}
              onAction={search ? () => setSearch('') : openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Course
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
                {filteredCourses.map((course) => {
                  const id = course._id || course.id;
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 line-clamp-1 max-w-sm">
                          {course.title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                          {course.description}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          ID: {id}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {course.price === 0 || !course.price
                          ? 'Free'
                          : `$${Number(course.price).toFixed(2)}`}
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
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
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <VideoIcon className="w-3 h-3" />
                          Lectures
                        </Link>

                        <button
                          onClick={() => openEditModal(course)}
                          className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeletingCourse(course)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                        >
                          Delete
                        </button>

                        <Link
                          href={`/courses/${id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 pl-1"
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

      {/* CREATE COURSE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Create New Course
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <ErrorMessage title="Validation Error" message={modalError} />
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input
                label="Course Title *"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Master Modern Web Development"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Course Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide an overview of the curriculum and objectives..."
                  className="block w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price ($) *"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />

                <Input
                  label="Thumbnail Image URL *"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Save Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Course
              </h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <ErrorMessage title="Update Error" message={modalError} />
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <Input
                label="Course Title *"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Course Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price ($) *"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />

                <Input
                  label="Thumbnail Image URL *"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCourse(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Update Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Confirm Delete
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete course &quot;
              <strong className="text-slate-800">{deletingCourse.title}</strong>
              &quot;? This will permanently remove the course and its record from
              the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingCourse(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteConfirm}
                isLoading={isSubmitting}
              >
                Delete Course
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
