import React from 'react';

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col h-full">
      <div className="w-full aspect-[16/10] bg-slate-200" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-5 w-4/5 bg-slate-200 rounded-md" />
          <div className="h-3.5 w-full bg-slate-200 rounded-md" />
          <div className="h-3.5 w-2/3 bg-slate-200 rounded-md" />
        </div>
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 w-20 bg-slate-200 rounded-md" />
          <div className="h-4 w-24 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const CourseListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const CourseDetailSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8">
      <div className="bg-[#14213D] text-white py-12 px-6 rounded-3xl">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded-full" />
          <div className="h-9 w-3/4 bg-slate-800 rounded-lg" />
          <div className="h-5 w-1/2 bg-slate-800 rounded-md" />
          <div className="flex gap-4 pt-2">
            <div className="h-6 w-24 bg-slate-800 rounded-full" />
            <div className="h-6 w-24 bg-slate-800 rounded-full" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-44 bg-white rounded-2xl border border-slate-200" />
          <div className="h-64 bg-white rounded-2xl border border-slate-200" />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="h-72 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    </div>
  );
};
