import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { BookOpenIcon, ArrowRightIcon } from './icons';

export interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const courseId = course._id || course.id || '';
  const isFree = course.price === 0 || !course.price;
  const formattedPrice = isFree ? 'Free' : `$${Number(course.price).toFixed(2)}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
      {/* High-quality Thumbnail Container */}
      <div className="relative w-full aspect-[16/10] bg-[#14213D] overflow-hidden">
        {course.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#14213D] via-[#1a2b4f] to-[#0f172a] flex flex-col items-center justify-center p-6 text-slate-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="p-3.5 rounded-2xl bg-white/10 text-blue-400 mb-2 backdrop-blur-xs">
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              DataPollex Course
            </span>
          </div>
        )}

        {/* Ambient Dark Gradient on bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Beautiful Price Badge */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight shadow-md backdrop-blur-md ${
              isFree
                ? 'bg-emerald-500 text-white'
                : 'bg-white/95 text-[#14213D] border border-slate-200/60'
            }`}
          >
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base sm:text-lg leading-snug">
            <Link href={`/courses/${courseId}`}>{course.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Action Link Footer */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-400 flex items-center gap-1.5">
            <BookOpenIcon className="w-3.5 h-3.5 text-blue-600" />
            Curriculum
          </span>

          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
          >
            <span>View Lectures</span>
            <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
