'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Lecture } from '@/types';
import { getLectureById, API_BASE_URL } from '@/lib/api';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { VideoIcon } from '@/components/ui/icons';

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
            const courseId = typeof data.course === 'object' && data.course !== null
              ? (data.course as { _id?: string; id?: string })._id || (data.course as { id?: string }).id
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
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4 animate-pulse">
        <div className="w-full aspect-video bg-slate-200 rounded-2xl" />
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-20 bg-slate-200 rounded" />
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <ErrorMessage
          title="Lecture Not Found"
          message={error || `Lecture ID "${lectureId}" could not be found at ${API_BASE_URL}/lectures/${lectureId}`}
        />
        <div className="text-center pt-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Return to Courses Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-slate-900">
          Courses
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{lecture.title}</span>
      </div>

      <VideoPlayer videoUrl={lecture.videoUrl} title={lecture.title} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          <VideoIcon className="w-4 h-4" />
          Lecture Details
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{lecture.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {lecture.description}
        </p>
      </div>
    </div>
  );
}
