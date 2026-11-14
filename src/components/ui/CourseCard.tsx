import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { Badge } from './Badge';
import { ClockIcon, BookOpenIcon, StarIcon, UsersIcon, ArrowRightIcon } from './icons';

export interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const courseId = course.id || course._id || '';
  const instructorName =
    typeof course.instructor === 'object' && course.instructor !== null
      ? course.instructor.name
      : typeof course.instructor === 'string'
      ? course.instructor
      : 'DataPollex Expert';

  const categoryVariant = (() => {
    const cat = (course.category || '').toLowerCase();
    if (cat.includes('data') || cat.includes('ai')) return 'purple';
    if (cat.includes('cloud') || cat.includes('devops')) return 'blue';
    if (cat.includes('cyber') || cat.includes('security')) return 'rose';
    if (cat.includes('business') || cat.includes('mgmt')) return 'amber';
    return 'emerald';
  })();

  const formattedPrice =
    course.price === 0 || !course.price ? 'Free' : `$${course.price.toFixed(2)}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Thumbnail / Header Gradient */}
      <div className="relative w-full h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-6 overflow-hidden">
        {course.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-between relative z-10">
            <div className="flex items-center justify-between">
              <Badge variant={categoryVariant} size="sm">
                {course.category || 'General'}
              </Badge>
              {course.level && (
                <span className="text-[11px] font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {course.level}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-300 line-clamp-1">
                DataPollex Learning
              </span>
            </div>
          </div>
        )}

        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Metadata chips */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {course.duration && (
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                {course.duration}
              </span>
            )}
            {course.totalLessons && (
              <span className="flex items-center gap-1">
                <BookOpenIcon className="w-3.5 h-3.5 text-slate-400" />
                {course.totalLessons} lessons
              </span>
            )}
            {typeof course.rating === 'number' && course.rating > 0 && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold ml-auto">
                <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {course.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base leading-snug">
            <Link href={`/courses/${courseId}`}>{course.title}</Link>
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.shortDescription || course.description}
          </p>
        </div>

        {/* Footer Area */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">
              {instructorName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">
                {instructorName}
              </p>
              {course.enrolledCount ? (
                <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
                  <UsersIcon className="w-2.5 h-2.5" />
                  {course.enrolledCount} learners
                </p>
              ) : null}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-slate-900">
              {formattedPrice}
            </div>
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 mt-0.5"
            >
              Details
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
