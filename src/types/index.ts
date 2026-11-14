/**
 * DataPollex Ltd. Simplified LMS - TypeScript Definitions
 * Matched strictly with Node.js/Express backend MongoDB models
 */

export interface Course {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lecture {
  _id: string;
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  course: string; // Course ObjectId reference
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  admin: AdminUser;
  data?: {
    token: string;
    admin: AdminUser;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

export interface LectureFormData {
  title: string;
  description: string;
  videoUrl: string;
}

export interface AdminStats {
  totalCourses: number;
  totalLectures: number;
}
