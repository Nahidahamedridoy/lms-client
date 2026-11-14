'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Course, Lecture } from '@/types';
import { getCourseById, getLectureById, getLecturesByCourse, API_BASE_URL } from '@/lib/api';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  VideoIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
} from '@/components/ui/icons';

export default function LectureViewingPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const lectureId = params?.lectureId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [allLectures, setAllLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLectureData = useCallback(async () => {
    if (!lectureId || !courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [courseData, lectureData, lecturesData] = await Promise.all([
        getCourseById(courseId),
        getLectureById(lectureId),
        getLecturesByCourse(courseId).catch(() => []),
      ]);

      setCourse(courseData);
      setLecture(lectureData);
      setAllLectures(lecturesData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to retrieve lecture data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, lectureId]);

  useEffect(() => {
    if (!lectureId || !courseId) return;
    let isMounted = true;

    Promise.all([
      getCourseById(courseId),
      getLectureById(lectureId),
      getLecturesByCourse(courseId).catch(() => []),
    ])
      .then(([courseData, lectureData, lecturesData]) => {
        if (isMounted) {
          setCourse(courseData);
          setLecture(lectureData);
          setAllLectures(lecturesData);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to retrieve lecture data';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [courseId, lectureId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/4" />
        <div className="w-full aspect-video bg-slate-200 rounded-3xl" />
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        <ErrorMessage
          title="Lecture Not Found"
          message={
            error ||
            `Lecture ID "${lectureId}" could not be retrieved from backend API.`
          }
          onRetry={fetchLectureData}
        />
        <div className="p-5 rounded-3xl bg-white border border-slate-200 text-sm space-y-3">
          <p className="text-xs text-slate-600">
            Endpoint queried: <code className="font-mono text-blue-600">{API_BASE_URL}/lectures/{lectureId}</code>
          </p>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Return to Course Details
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Next and Previous Lectures
  const currentIndex = allLectures.findIndex(
    (l) => (l._id || l.id) === (lecture._id || lecture.id)
  );
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex >= 0 && currentIndex < allLectures.length - 1
      ? allLectures[currentIndex + 1]
      : null;

  return (
    <div className="pb-20 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-slate-900 transition-colors">
          Courses
        </Link>
        <span>/</span>
        {course && (
          <>
            <Link
              href={`/courses/${courseId}`}
              className="hover:text-slate-900 transition-colors truncate max-w-xs"
            >
              {course.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 font-bold truncate max-w-xs">
          {lecture.title}
        </span>
      </nav>

      {/* Main Grid: Video Player + Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left / Main Column: Video Player and Lecture Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Large Responsive Video Player */}
          <VideoPlayer videoUrl={lecture.videoUrl} title={lecture.title} />

          {/* Navigation Controls: Previous / Next Buttons */}
          <div className="flex items-center justify-between gap-4 py-3 px-1 border-b border-slate-200">
            {prevLecture ? (
              <Link
                href={`/courses/${courseId}/lectures/${prevLecture._id || prevLecture.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                ← Previous Lesson
              </Link>
            ) : (
              <span className="text-xs text-slate-400 font-medium">First Lesson</span>
            )}

            <div className="text-xs text-slate-500 font-semibold tracking-wide">
              {currentIndex >= 0 ? `Lesson ${currentIndex + 1} of ${allLectures.length}` : ''}
            </div>

            {nextLecture ? (
              <Link
                href={`/courses/${courseId}/lectures/${nextLecture._id || nextLecture.id}`}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Next Lesson</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Final Lesson</span>
            )}
          </div>

          {/* Lecture Title & Description Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <VideoIcon className="w-4 h-4" />
              <span>Current Lesson Overview</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lecture.title}
            </h1>

            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pt-2">
              {lecture.description}
            </div>
          </div>
        </div>

        {/* Right Column: Playlist Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <BookOpenIcon className="w-4 h-4 text-blue-600" />
                Course Curriculum
              </div>
              {course && (
                <p className="text-xs text-slate-500 font-semibold truncate mt-1">
                  {course.title}
                </p>
              )}
            </div>

            <div className="max-h-[550px] overflow-y-auto divide-y divide-slate-100">
              {allLectures.map((item, idx) => {
                const itemId = item._id || item.id;
                const isCurrent = itemId === (lecture._id || lecture.id);

                return (
                  <Link
                    key={itemId}
                    href={`/courses/${courseId}/lectures/${itemId}`}
                    className={`block p-4 transition-colors ${
                      isCurrent
                        ? 'bg-blue-50/90 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-bold line-clamp-1 ${
                            isCurrent ? 'text-blue-900' : 'text-slate-800'
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      {isCurrent && (
                        <CheckCircleIcon className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
              <Link
                href={`/courses/${courseId}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                ← Return to Course Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
