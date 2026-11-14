import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { BookOpenIcon, ArrowRightIcon } from './icons';

export interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const courseId = course._id || course.id || '';
  const formattedPrice =
    course.price === 0 || !course.price ? 'Free' : `$${Number(course.price).toFixed(2)}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
        {course.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col items-center justify-center p-6 text-slate-400">
            <BookOpenIcon className="w-10 h-10 text-blue-500/60 mb-2" />
            <span className="text-xs font-medium text-slate-300">DataPollex Course</span>
          </div>
        )}

        {/* Price Tag Badge */}
        <div className="absolute top-3.5 right-3.5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-md backdrop-blur-xs">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base leading-snug">
            <Link href={`/courses/${courseId}`}>{course.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Card Action Link */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <BookOpenIcon className="w-3.5 h-3.5 text-blue-500" />
            Full Curriculum
          </span>

          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
          >
            View Lectures
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
