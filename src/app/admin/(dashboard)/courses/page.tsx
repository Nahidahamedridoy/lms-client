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
import { Badge } from '@/components/ui/Badge';
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
  EditIcon,
  TrashIcon,
  XIcon,
  AlertCircleIcon,
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
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[#14213D] tracking-tight">
              Course Management
            </h2>
            <Badge variant="navy" size="sm">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, and organize LMS courses directly synchronized with MongoDB backend ({API_BASE_URL}/courses)
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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-88">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
          <span>Showing <strong className="text-slate-800">{filteredCourses.length}</strong> of <strong className="text-slate-800">{courses.length}</strong> courses</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Courses Table / Empty State */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={search ? 'No Matching Courses' : 'No Courses Created Yet'}
              description={
                search
                  ? `No course matches "${search}". Try searching with a different keyword or reset the filter.`
                  : `There are currently no courses in the database. Click "+ Add New Course" above to create the very first course.`
              }
              actionText={search ? 'Clear Search' : 'Create First Course'}
              onAction={search ? () => setSearch('') : openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Course Overview
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
                {filteredCourses.map((course) => {
                  const id = course._id || course.id;
                  const isFree = course.price === 0 || !course.price;
                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#14213D] text-sm group-hover:text-blue-600 transition-colors line-clamp-1 max-w-md">
                          {course.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-md mt-0.5">
                          {course.description}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            ID: {id}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {isFree ? (
                          <Badge variant="emerald" size="sm">
                            Free
                          </Badge>
                        ) : (
                          <Badge variant="navy" size="sm">
                            ${Number(course.price).toFixed(2)}
                          </Badge>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-16 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                          {course.thumbnail ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <BookOpenIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/lectures?courseId=${id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Manage Course Lectures"
                          >
                            <VideoIcon className="w-3.5 h-3.5 text-blue-600" />
                            Lectures
                          </Link>

                          <button
                            onClick={() => openEditModal(course)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Course"
                          >
                            <EditIcon className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => setDeletingCourse(course)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Course"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            Delete
                          </button>

                          <Link
                            href={`/courses/${id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-700 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                            title="Preview on Public Student Catalog"
                          >
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                          </Link>
                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <BookOpenIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#14213D] tracking-tight">
                    Create New Course
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add a new course curriculum to the LMS catalog
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
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
                placeholder="e.g. Master Modern Full-Stack Development"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Course Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide an overview of the curriculum, outcomes, and prerequisites..."
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price ($ USD) *"
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

              {/* Live Thumbnail Preview */}
              {formData.thumbnail && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Live Thumbnail Preview:
                  </span>
                  <div className="aspect-video w-full max-h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <EditIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#14213D] tracking-tight">
                    Edit Course
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update details for {editingCourse.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Course Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price ($ USD) *"
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

              {/* Live Thumbnail Preview */}
              {formData.thumbnail && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Thumbnail Preview:
                  </span>
                  <div className="aspect-video w-full max-h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircleIcon className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Course Deletion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete course &quot;
                <strong className="text-slate-900">{deletingCourse.title}</strong>
                &quot;? This action cannot be undone and will delete the record from the MongoDB database.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
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
