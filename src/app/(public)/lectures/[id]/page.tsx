'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Lecture } from '@/types';
import { getLectureById, API_BASE_URL } from '@/lib/api';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { VideoIcon, ArrowRightIcon } from '@/components/ui/icons';

export default function DirectLecturePage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lectureId) return;
    let isMounted = true;

    getLectureById(lectureId)
      .then((data) => {
        if (isMounted) {
          setLecture(data);
          // If lecture has a course property, redirect to the full nested page for richer playlist context
          if (data && data.course) {
            const courseId =
              typeof data.course === 'object' && data.course !== null
                ? (data.course as { _id?: string; id?: string })._id ||
                  (data.course as { id?: string }).id
                : String(data.course);
            if (courseId) {
              router.replace(`/courses/${courseId}/lectures/${lectureId}`);
              return;
            }
          }
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to retrieve lecture';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lectureId, router]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 animate-pulse">
        <div className="w-full aspect-video bg-slate-200 rounded-3xl" />
        <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-6">
        <ErrorMessage
          title="Lecture Not Found"
          message={
            error ||
            `Lecture ID "${lectureId}" could not be located in the database (${API_BASE_URL}/lectures/${lectureId}).`
          }
        />
        <div className="text-center pt-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Return to Courses Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-blue-600 transition-colors">
          Courses
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{lecture.title}</span>
      </div>

      {/* Video Player */}
      <VideoPlayer videoUrl={lecture.videoUrl} title={lecture.title} />

      {/* Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <VideoIcon className="w-4 h-4" />
          <span>Lecture Overview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
          {lecture.title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {lecture.description}
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Browse other courses in catalog
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
