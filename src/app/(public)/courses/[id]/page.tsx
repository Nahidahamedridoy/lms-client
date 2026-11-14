'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Course } from '@/types';
import { getCourseById, API_BASE_URL } from '@/lib/api';
import { CourseDetailSkeleton } from '@/components/ui/CourseSkeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ClockIcon,
  BookOpenIcon,
  UsersIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GraduationCapIcon,
  VideoIcon,
  AwardIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons';

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState<boolean>(false);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to retrieve course details from backend API';
      setError(message);
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;
    getCourseById(courseId)
      .then((data) => {
        if (isMounted) {
          setCourse(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to retrieve course details from backend API';
          setError(message);
          setCourse(null);
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
          onRetry={fetchCourseData}
        />
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-sm space-y-3">
          <h4 className="font-semibold text-slate-800">
            Backend Verification Note
          </h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            As requested, no mock course data is generated. The system queried{' '}
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

  const instructorName =
    typeof course.instructor === 'object' && course.instructor !== null
      ? course.instructor.name
      : typeof course.instructor === 'string'
      ? course.instructor
      : 'DataPollex Faculty';

  const instructorTitle =
    typeof course.instructor === 'object' && course.instructor?.title
      ? course.instructor.title
      : 'Senior Technical Lead & Educator';

  const formattedPrice =
    course.price === 0 || !course.price ? 'Free' : `$${course.price.toFixed(2)}`;

  return (
    <div className="pb-20 space-y-10">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
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

          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue" size="md">
                {course.category || 'Technology'}
              </Badge>
              {course.level && (
                <span className="text-xs font-medium text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {course.level}
                </span>
              )}
              {course.isFeatured && (
                <span className="text-xs font-semibold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.shortDescription || course.description}
            </p>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {instructorName.charAt(0)}
                </div>
                <span>
                  Created by{' '}
                  <strong className="text-white font-medium">
                    {instructorName}
                  </strong>
                </span>
              </div>

              {course.duration && (
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
              )}

              {course.totalLessons && (
                <div className="flex items-center gap-1.5">
                  <BookOpenIcon className="w-4 h-4 text-slate-400" />
                  <span>{course.totalLessons} lessons</span>
                </div>
              )}

              {typeof course.rating === 'number' && course.rating > 0 && (
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <StarIcon className="w-4 h-4 fill-amber-400" />
                  <span>{course.rating.toFixed(1)} Rating</span>
                </div>
              )}

              {course.enrolledCount ? (
                <div className="flex items-center gap-1.5 text-slate-300">
                  <UsersIcon className="w-4 h-4 text-slate-400" />
                  <span>{course.enrolledCount} enrolled</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Details, Syllabus, Outcomes */}
          <div className="lg:col-span-8 space-y-10">
            {/* Full Description */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Course Overview
              </h2>
              <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </section>

            {/* What you'll learn */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  What You Will Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="text-emerald-500 mt-0.5 shrink-0">
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-700 leading-snug">
                        {outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum / Syllabus */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Course Syllabus
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Structured lessons provided by your backend
                  </p>
                </div>
                {course.totalLessons && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {course.totalLessons} Total Lessons
                  </span>
                )}
              </div>

              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules.map((mod, modIdx) => (
                    <div
                      key={mod.id || mod._id || modIdx}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-slate-50 px-4 py-3 flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>
                          Module {modIdx + 1}: {mod.title}
                        </span>
                        <span className="text-xs text-slate-500 font-normal">
                          {mod.lessons.length} lessons
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 bg-white">
                        {mod.lessons.map((lesson, lessonIdx) => (
                          <div
                            key={lesson.id || lesson._id || lessonIdx}
                            className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <VideoIcon className="w-4 h-4 text-slate-400" />
                              <span>{lesson.title}</span>
                              {lesson.isFreePreview && (
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                  Preview
                                </span>
                              )}
                            </div>
                            {lesson.duration && (
                              <span className="text-xs text-slate-400 font-mono">
                                {lesson.duration}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : course.syllabus && course.syllabus.length > 0 ? (
                <div className="space-y-3">
                  {course.syllabus.map((section, sIdx) => (
                    <div
                      key={sIdx}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-slate-50 px-4 py-3 font-semibold text-slate-800 text-sm">
                        {section.title}
                      </div>
                      <div className="divide-y divide-slate-100 bg-white">
                        {section.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm text-slate-700"
                          >
                            <div className="flex items-center gap-2">
                              <VideoIcon className="w-4 h-4 text-slate-400" />
                              <span>{lesson.title}</span>
                            </div>
                            {lesson.duration && (
                              <span className="text-xs text-slate-400 font-mono">
                                {lesson.duration}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 rounded-xl bg-slate-50 text-slate-500 text-sm">
                  Detailed lesson breakdown will be populated by the backend API.
                </div>
              )}
            </section>

            {/* Instructor Details */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                About the Instructor
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                  {instructorName.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {instructorName}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium">
                    {instructorTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 pt-1 leading-relaxed">
                    {typeof course.instructor === 'object' && course.instructor?.bio
                      ? course.instructor.bio
                      : 'Specialist practitioner and faculty member at DataPollex Ltd., dedicated to mentoring engineers and technology leaders.'}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Enrollment Sidebar Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-lg shadow-slate-200/50 space-y-6">
              {/* Price Display */}
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Course Enrollment
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {formattedPrice}
                  </span>
                  {course.originalPrice && (
                    <span className="text-base text-slate-400 line-through">
                      ${course.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {enrolled ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium text-center flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                    Enrolled Successfully!
                  </div>
                ) : (
                  <Button
                    onClick={() => setEnrolled(true)}
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                  >
                    Enroll Now
                  </Button>
                )}
                <Link
                  href="/courses"
                  className="block text-center text-xs font-medium text-slate-500 hover:text-slate-800 py-1 transition-colors"
                >
                  Explore other courses
                </Link>
              </div>

              {/* Guarantee Checklist */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  This Course Includes:
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <VideoIcon className="w-4 h-4 text-blue-600" />
                    <span>Comprehensive video modules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AwardIcon className="w-4 h-4 text-blue-600" />
                    <span>DataPollex Certificate of Completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                    <span>Lifetime access to course materials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCapIcon className="w-4 h-4 text-blue-600" />
                    <span>Real-world recruitment projects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
