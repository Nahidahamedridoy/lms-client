/**
 * DataPollex Ltd. LMS - API Client
 * Base URL: http://localhost:5000/api
 */

import { Course, CourseFilters, AuthResponse, AdminStats } from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'datapollex_lms_admin_token';
const USER_KEY = 'datapollex_lms_admin_user';

// Auth Token Utilities (browser-safe)
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredAuth = (token: string, user?: unknown): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Generic Request Handler
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Unable to reach backend API at ${API_BASE_URL}. Ensure your Node.js/Express server is running on port 5000.`
      );
    }
    throw error;
  }
}

// -------------------------------------------------------------
// Course Public API Methods
// -------------------------------------------------------------

/**
 * Fetch all published courses with optional query filters
 */
export async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  const queryParams = new URLSearchParams();

  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.category && filters.category !== 'All') {
    queryParams.append('category', filters.category);
  }
  if (filters?.level && filters.level !== 'All') {
    queryParams.append('level', filters.level);
  }
  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;

  const res = await request<Course[] | { courses?: Course[]; data?: Course[] }>(endpoint);

  // Normalize response across standard backend return structures
  if (Array.isArray(res)) {
    return res;
  }
  if (res?.courses && Array.isArray(res.courses)) {
    return res.courses;
  }
  if (res?.data && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

/**
 * Fetch a single course by ID or slug
 */
export async function getCourseById(id: string): Promise<Course> {
  const res = await request<Course | { course?: Course; data?: Course }>(`/courses/${id}`);

  if ('course' in res && res.course) {
    return res.course;
  }
  if ('data' in res && res.data && !Array.isArray(res.data)) {
    return res.data;
  }
  return res as Course;
}

/**
 * Fetch featured courses for home page
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  try {
    // Try dedicated featured endpoint first
    const res = await request<Course[] | { courses?: Course[]; data?: Course[] }>('/courses/featured');
    if (Array.isArray(res)) return res;
    if (res?.courses && Array.isArray(res.courses)) return res.courses;
    if (res?.data && Array.isArray(res.data)) return res.data;
  } catch {
    // Fallback to general courses with limit if /featured is not implemented in backend
  }

  const allCourses = await getCourses({ limit: 4 });
  return allCourses.filter((c) => c.isFeatured).length > 0
    ? allCourses.filter((c) => c.isFeatured)
    : allCourses.slice(0, 3);
}

// -------------------------------------------------------------
// Admin & Authentication API Methods
// -------------------------------------------------------------

/**
 * Authenticate admin user
 */
export async function loginAdmin(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse | { token: string; data?: { user: AuthResponse['user'] } }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
  );

  // Normalize token and user
  let token = '';
  let user: AuthResponse['user'];

  if ('token' in res && typeof res.token === 'string') {
    token = res.token;
  }

  if ('user' in res && res.user) {
    user = res.user;
  } else if ('data' in res && res.data?.user) {
    user = res.data.user;
  } else {
    user = {
      id: 'admin',
      name: 'Administrator',
      email: credentials.email,
      role: 'admin',
    };
  }

  setStoredAuth(token, user);
  return { token, user };
}

/**
 * Fetch admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<AdminStats> {
  try {
    const res = await request<AdminStats | { stats?: AdminStats; data?: AdminStats }>(
      '/admin/stats'
    );
    if ('stats' in res && res.stats) return res.stats;
    if ('data' in res && res.data) return res.data;
    if ('totalCourses' in res) return res as AdminStats;
  } catch {
    // Backend may not have /admin/stats yet; compute from courses
  }

  // Derive stats gracefully if endpoint is not yet mounted
  try {
    const courses = await getCourses();
    return {
      totalCourses: courses.length,
      totalStudents: 0,
      totalEnrollments: courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0),
      activeCourses: courses.filter((c) => c.status !== 'archived').length,
    };
  } catch {
    return {
      totalCourses: 0,
      totalStudents: 0,
      totalEnrollments: 0,
      activeCourses: 0,
    };
  }
}

/**
 * Fetch all courses for Admin (including drafts and archived)
 */
export async function getAdminCourses(): Promise<Course[]> {
  try {
    const res = await request<Course[] | { courses?: Course[]; data?: Course[] }>(
      '/admin/courses'
    );
    if (Array.isArray(res)) return res;
    if (res?.courses && Array.isArray(res.courses)) return res.courses;
    if (res?.data && Array.isArray(res.data)) return res.data;
  } catch {
    // Fall back to standard courses endpoint
  }
  return getCourses();
}

/**
 * Health check helper to test backend connectivity
 */
export async function checkBackendHealth(): Promise<{ online: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      return { online: true, message: 'Backend connected' };
    }
    return { online: false, message: `Status ${res.status}` };
  } catch {
    return {
      online: false,
      message: `Offline (Cannot reach ${API_BASE_URL})`,
    };
  }
}
