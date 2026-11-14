'use client';

import React, { useEffect, useState, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Course, Lecture, LectureFormData } from '@/types';
import {
  getCourses,
  getLecturesByCourse,
  createLecture,
  updateLecture,
  deleteLecture,
  API_BASE_URL,
} from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  VideoIcon,
  PlusIcon,
  RefreshIcon,
  BookOpenIcon,
  ArrowRightIcon,
  XIcon,
} from '@/components/ui/icons';

export default function AdminLecturesPage() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams?.get('courseId') || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [deletingLecture, setDeletingLecture] = useState<Lecture | null>(null);
  const [, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<LectureFormData>({
    title: '',
    description: '',
    videoUrl: '',
  });

  // Target course ID for creating a lecture
  const [targetCourseId, setTargetCourseId] = useState<string>(initialCourseId);

  // Fetch all courses
  const fetchCoursesList = useCallback(async () => {
    try {
      const data = await getCourses();
      setCourses(data);
      if (!selectedCourseId && data.length > 0) {
        const firstId = data[0]._id || data[0].id;
        setSelectedCourseId(firstId);
        setTargetCourseId(firstId);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch courses list';
      setError(msg);
    }
  }, [selectedCourseId]);

  // Fetch lectures for selected course
  const fetchLecturesForCourse = useCallback(async (courseId: string) => {
    if (!courseId) {
      setLectures([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getLecturesByCourse(courseId);
      setLectures(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to fetch lectures from backend';
      setError(msg);
      setLectures([]);
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
          const activeId = initialCourseId || (data.length > 0 ? (data[0]._id || data[0].id) : '');
          if (activeId) {
            setSelectedCourseId(activeId);
            setTargetCourseId(activeId);
            fetchLecturesForCourse(activeId);
          } else {
            setIsLoading(false);
          }
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to fetch courses';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialCourseId, fetchLecturesForCourse]);

  const handleCourseChange = (newCourseId: string) => {
    setSelectedCourseId(newCourseId);
    setTargetCourseId(newCourseId);
    startTransition(() => {
      fetchLecturesForCourse(newCourseId);
    });
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
    });
    setTargetCourseId(selectedCourseId || (courses[0]?._id || courses[0]?.id || ''));
    setModalError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (lec: Lecture) => {
    setEditingLecture(lec);
    setFormData({
      title: lec.title,
      description: lec.description,
      videoUrl: lec.videoUrl,
    });
    setModalError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseId) {
      setModalError('Please select a course for this lecture.');
      return;
    }
    if (!formData.title || !formData.description || !formData.videoUrl) {
      setModalError('All fields (Title, Description, Video URL) are required.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      const newLecture = await createLecture(targetCourseId, formData);
      if (targetCourseId === selectedCourseId) {
        setLectures((prev) => [...prev, newLecture]);
      }
      setIsCreateOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create lecture';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture) return;
    const lectureId = editingLecture._id || editingLecture.id;
    if (!lectureId) return;

    setIsSubmitting(true);
    setModalError(null);
    try {
      const updated = await updateLecture(lectureId, formData);
      setLectures((prev) =>
        prev.map((l) => ((l._id || l.id) === lectureId ? updated : l))
      );
      setEditingLecture(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update lecture';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLecture) return;
    const lectureId = deletingLecture._id || deletingLecture.id;
    if (!lectureId) return;

    setIsSubmitting(true);
    try {
      await deleteLecture(lectureId);
      setLectures((prev) => prev.filter((l) => (l._id || l.id) !== lectureId));
      setDeletingLecture(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete lecture';
      alert(`Delete Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCourse = courses.find(
    (c) => (c._id || c.id) === selectedCourseId
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Lecture Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, update, and organize course lectures synchronized with {API_BASE_URL}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchCoursesList();
              if (selectedCourseId) fetchLecturesForCourse(selectedCourseId);
            }}
            isLoading={isLoading}
            leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            disabled={courses.length === 0}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Add New Lecture
          </Button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          title="Lecture Synchronization Notice"
          message={error}
          onRetry={() => {
            fetchCoursesList();
            if (selectedCourseId) fetchLecturesForCourse(selectedCourseId);
          }}
        />
      )}

      {/* Course Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <BookOpenIcon className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="min-w-0 flex-1 sm:flex-initial">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Select Course to Manage Lectures:
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="block w-full sm:w-80 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {courses.length === 0 ? (
                <option value="">No courses created yet</option>
              ) : (
                courses.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.title}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {activeCourse && (
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>
              Total in Course: <strong>{lectures.length}</strong>
            </span>
            <span>•</span>
            <Link
              href={`/courses/${selectedCourseId}`}
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              View Public Page
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Lectures Table / Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {courses.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Courses Created Yet"
              description="You must create at least one course before you can attach lectures to it."
              actionText="Go to Course Management"
              actionHref="/admin/courses"
            />
          </div>
        ) : isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-slate-100 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
          </div>
        ) : lectures.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Lectures Added for this Course"
              description={`The course "${activeCourse?.title || ''}" currently has no lectures in the backend database. Click below to add the first lecture.`}
              actionText="Add First Lecture"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Lecture Title & Details
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Video URL
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {lectures.map((lec, index) => {
                  const id = lec._id || lec.id;
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 line-clamp-1 max-w-sm">
                          {lec.title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-2 max-w-sm mt-0.5">
                          {lec.description}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          ID: {id}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-600 max-w-xs truncate block">
                          {lec.videoUrl}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/courses/${selectedCourseId}/lectures/${id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <VideoIcon className="w-3 h-3" />
                          Watch
                        </Link>

                        <button
                          onClick={() => openEditModal(lec)}
                          className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeletingLecture(lec)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE LECTURE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Add Lecture to Course
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
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Target Course *
                </label>
                <select
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  required
                >
                  {courses.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Lecture Title *"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Introduction to TypeScript and Node"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Lecture Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Summarize the topics covered in this lesson..."
                  className="block w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  required
                />
              </div>

              <Input
                label="Video URL (YouTube, Vimeo, or MP4) *"
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />

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
                  Save Lecture
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LECTURE MODAL */}
      {editingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Lecture
              </h3>
              <button
                onClick={() => setEditingLecture(null)}
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
                label="Lecture Title *"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Lecture Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  required
                />
              </div>

              <Input
                label="Video URL *"
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                required
              />

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingLecture(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Update Lecture
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Confirm Delete Lecture
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete lecture &quot;
              <strong className="text-slate-800">{deletingLecture.title}</strong>
              &quot;? This cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingLecture(null)}
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
                Delete Lecture
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
