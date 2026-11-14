/**
 * DataPollex Ltd. LMS - TypeScript Definitions
 */

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Lesson {
  id?: string;
  _id?: string;
  title: string;
  duration?: string;
  videoUrl?: string;
  isFreePreview?: boolean;
  order?: number;
}

export interface Module {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Instructor {
  id?: string;
  _id?: string;
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
}

export interface Course {
  id?: string;
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  category: string;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  instructor?: Instructor | string;
  duration?: string;
  totalLessons?: number;
  modules?: Module[];
  syllabus?: Array<{
    title: string;
    lessons: Lesson[];
  }>;
  learningOutcomes?: string[];
  prerequisites?: string[];
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  enrolledCount?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'instructor';
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface AdminStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  activeCourses: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  courses?: T; // For backends returning { courses: [...] } directly
  stats?: AdminStats;
  total?: number;
}
