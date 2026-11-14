'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Course, Lecture } from '@/types';
import { getCourseById, getLecturesByCourse, API_BASE_URL } from '@/lib/api';
import { CourseDetailSkeleton } from '@/components/ui/CourseSkeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  BookOpenIcon,
  VideoIcon,
  ArrowRightIcon,
  ClockIcon,
  RefreshIcon,
} from '@/components/ui/icons';

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseAndLectures = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [courseData, lecturesData] = await Promise.all([
        getCourseById(courseId),
        getLecturesByCourse(courseId).catch(() => []),
      ]);
      setCourse(courseData);
      setLectures(lecturesData);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to retrieve course data from backend API';
      setError(message);
      setCourse(null);
      setLectures([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;

    Promise.all([
      getCourseById(courseId),
      getLecturesByCourse(courseId).catch(() => []),
    ])
      .then(([courseData, lecturesData]) => {
        if (isMounted) {
          setCourse(courseData);
          setLectures(lecturesData);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to retrieve course data from backend API';
          setError(message);
          setCourse(null);
          setLectures([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CourseDetailSkeleton />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        <ErrorMessage
          title="Unable to Load Course Details"
          message={
            error ||
            `Course with identifier "${courseId}" was not found in the backend API.`
          }
          onRetry={fetchCourseAndLectures}
        />
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-sm space-y-3">
          <h4 className="font-semibold text-slate-800">
            Backend Verification Note
          </h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            The frontend queried{' '}
            <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-600">
              {API_BASE_URL}/courses/{courseId}
            </code>
            . Please verify that your Node.js/Express backend server is running
            and that this course ID exists in your database.
          </p>
          <div className="pt-2">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Return to Course Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedPrice =
    course.price === 0 || !course.price ? 'Free' : `$${Number(course.price).toFixed(2)}`;

  const firstLecture = lectures.length > 0 ? lectures[0] : null;

  return (
    <div className="pb-20 space-y-10">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-200 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/courses"
              className="hover:text-slate-200 transition-colors"
            >
              Courses
            </Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-xs sm:max-w-md">
              {course.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <BookOpenIcon className="w-3.5 h-3.5" />
                <span>Course Details</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <VideoIcon className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">
                    {lectures.length}
                  </span>{' '}
                  Lecture{lectures.length === 1 ? '' : 's'}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Access:</span>
                  <span className="font-bold text-emerald-400">
                    {formattedPrice}
                  </span>
                </div>

                {course.createdAt && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>
                      Added {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {firstLecture && (
                <div className="pt-2">
                  <Link
                    href={`/courses/${courseId}/lectures/${firstLecture._id || firstLecture.id}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <VideoIcon className="w-4 h-4" />
                    Start Watching Lectures
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Thumbnail preview */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 aspect-video flex items-center justify-center">
                {course.thumbnail ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-500 flex flex-col items-center">
                    <BookOpenIcon className="w-12 h-12 text-slate-600 mb-2" />
                    <span className="text-xs">No image preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Overview & Lectures */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left / Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Course Description */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                About This Course
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </section>

            {/* Lectures Section */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Course Lectures ({lectures.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any lecture to open the embedded video player
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCourseAndLectures}
                  leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
                >
                  Refresh
                </Button>
              </div>

              {lectures.length === 0 ? (
                <EmptyState
                  title="No Lectures Added Yet"
                  description={`This course has no lectures attached in the backend at ${API_BASE_URL}/courses/${courseId}/lectures. You can add lectures from the Admin Lecture Management page.`}
                  actionText="Admin: Add Lecture"
                  actionHref={`/admin/lectures?courseId=${courseId}`}
                />
              ) : (
                <div className="space-y-3">
                  {lectures.map((lecture, index) => {
                    const lectureId = lecture._id || lecture.id;
                    return (
                      <Link
                        key={lectureId}
                        href={`/courses/${courseId}/lectures/${lectureId}`}
                        className="group flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {index + 1}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {lecture.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {lecture.description}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-blue-600 mt-1">
                          <span>Watch</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Course Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Course Summary
              </h3>

              <div className="space-y-3 text-sm divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500 text-xs">Total Lectures</span>
                  <span className="font-semibold text-slate-900">
                    {lectures.length}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-slate-500 text-xs">Course Price</span>
                  <span className="font-bold text-slate-900">
                    {formattedPrice}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-slate-500 text-xs">Backend Resource</span>
                  <span className="font-mono text-xs text-blue-600 truncate max-w-[150px]">
                    /api/courses/{courseId}
                  </span>
                </div>
              </div>

              {firstLecture ? (
                <Link
                  href={`/courses/${courseId}/lectures/${firstLecture._id || firstLecture.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs"
                >
                  <VideoIcon className="w-4 h-4" />
                  Watch First Lecture
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  ← Browse Other Courses
                </Link>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Direct Public Access</p>
              <p>
                All course lectures are directly accessible for viewing without any
                student registration or enrollment restrictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
