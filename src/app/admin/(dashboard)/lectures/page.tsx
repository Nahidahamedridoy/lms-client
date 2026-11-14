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
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  VideoIcon,
  PlusIcon,
  RefreshIcon,
  BookOpenIcon,
  ArrowRightIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  AlertCircleIcon,
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
        const firstId = data[0]._id || data[0].id || '';
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
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[#14213D] tracking-tight">
              Lecture Management
            </h2>
            <Badge variant="royal" size="sm">
              {lectures.length} {lectures.length === 1 ? 'Lecture' : 'Lectures'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, update, and sequence course video lectures synchronized with {API_BASE_URL}
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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpenIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 sm:flex-initial">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Target Course:
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="block w-full sm:w-88 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer transition-all"
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
          <div className="text-xs font-medium text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span>Lectures in course:</span>
              <strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                {lectures.length}
              </strong>
            </span>
            <span className="text-slate-300">•</span>
            <Link
              href={`/courses/${selectedCourseId}`}
              target="_blank"
              className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 transition-colors"
            >
              Preview Public Course
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Lectures Table / Empty State */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
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
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : lectures.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Lectures in Selected Course"
              description={`The course "${activeCourse?.title || ''}" currently has no lectures registered in the database. Add the first lecture below.`}
              actionText="Add First Lecture"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    #
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Lecture Title & Overview
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Video Stream URL
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {lectures.map((lec, index) => {
                  const id = lec._id || lec.id;
                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center border border-blue-100">
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-[#14213D] text-sm group-hover:text-blue-600 transition-colors line-clamp-1 max-w-sm">
                          {lec.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-2 max-w-sm mt-0.5">
                          {lec.description}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                          ID: {id}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-xs">
                          <VideoIcon className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-mono text-xs text-slate-600 truncate block bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                            {lec.videoUrl}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Link
                            href={`/courses/${selectedCourseId}/lectures/${id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Watch Lecture"
                          >
                            <VideoIcon className="w-3.5 h-3.5" />
                            Watch
                          </Link>

                          <button
                            onClick={() => openEditModal(lec)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Lecture"
                          >
                            <EditIcon className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => setDeletingLecture(lec)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Lecture"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            Delete
                          </button>
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

      {/* CREATE LECTURE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <VideoIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#14213D] tracking-tight">
                    Add Lecture to Course
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add video content and notes to the selected curriculum
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
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Course *
                </label>
                <select
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
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
                placeholder="e.g. Introduction to TypeScript Architecture"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lecture Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Summarize the core topics covered in this lesson..."
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  required
                />
              </div>

              <Input
                label="Video URL (YouTube, Vimeo, or direct MP4) *"
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />

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
                  Save Lecture
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LECTURE MODAL */}
      {editingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <EditIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#14213D] tracking-tight">
                    Edit Lecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update lecture content and video streaming URL
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingLecture(null)}
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
                label="Lecture Title *"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lecture Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircleIcon className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Lecture Deletion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete lecture &quot;
                <strong className="text-slate-900">{deletingLecture.title}</strong>
                &quot;? This will remove the video record from the database.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
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
