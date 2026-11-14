/**
 * DataPollex Ltd. Simplified LMS - API Client
 * Base URL: http://localhost:5000/api
 * Matches all backend routes from lms-server
 */

import {
  Course,
  Lecture,
  AuthResponse,
  ApiResponse,
  CourseFormData,
  LectureFormData,
  AdminUser,
} from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'datapollex_lms_admin_token';
const ADMIN_KEY = 'datapollex_lms_admin_user';

// -------------------------------------------------------------
// Auth Token Storage (Browser Safe)
// -------------------------------------------------------------

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredAuth = (token: string, admin?: AdminUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  if (admin) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  }
};

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};

export const getStoredAdmin = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(ADMIN_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

// -------------------------------------------------------------
// Generic Request Wrapper with Automatic Bearer Token
// -------------------------------------------------------------

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

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
      if (response.status === 401 && typeof window !== 'undefined') {
        // If unauthorized on a protected route, token is invalid or expired
        if (token && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
          clearStoredAuth();
          window.location.href = '/admin/login?error=session_expired';
        }
      }

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
// Course API Methods
// -------------------------------------------------------------

/**
 * GET /api/courses
 * Fetch all courses
 */
export async function getCourses(): Promise<Course[]> {
  const res = await request<ApiResponse<Course[]> | Course[]>('/courses');
  if (Array.isArray(res)) return res;
  if (res && res.data && Array.isArray(res.data)) return res.data;
  return [];
}

/**
 * GET /api/courses/:id
 * Fetch course by ID
 */
export async function getCourseById(id: string): Promise<Course> {
  const res = await request<ApiResponse<Course> | Course>(`/courses/${id}`);
  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as Course;
}

/**
 * POST /api/courses
 * Create course (Admin only, requires Bearer token)
 */
export async function createCourse(data: CourseFormData): Promise<Course> {
  const res = await request<ApiResponse<Course>>('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.data) return res.data;
  return res as unknown as Course;
}

/**
 * PUT /api/courses/:id
 * Update course (Admin only, requires Bearer token)
 */
export async function updateCourse(
  id: string,
  data: Partial<CourseFormData>
): Promise<Course> {
  const res = await request<ApiResponse<Course>>(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (res.data) return res.data;
  return res as unknown as Course;
}

/**
 * DELETE /api/courses/:id
 * Delete course (Admin only, requires Bearer token)
 */
export async function deleteCourse(id: string): Promise<Course> {
  const res = await request<ApiResponse<Course>>(`/courses/${id}`, {
    method: 'DELETE',
  });
  if (res.data) return res.data;
  return res as unknown as Course;
}

// -------------------------------------------------------------
// Lecture API Methods
// -------------------------------------------------------------

/**
 * GET /api/courses/:courseId/lectures
 * Fetch all lectures for a specific course
 */
export async function getLecturesByCourse(courseId: string): Promise<Lecture[]> {
  const res = await request<ApiResponse<Lecture[]> | Lecture[]>(
    `/courses/${courseId}/lectures`
  );
  if (Array.isArray(res)) return res;
  if (res && res.data && Array.isArray(res.data)) return res.data;
  return [];
}

/**
 * GET /api/lectures/:id
 * Fetch a single lecture by ID
 */
export async function getLectureById(id: string): Promise<Lecture> {
  const res = await request<ApiResponse<Lecture> | Lecture>(`/lectures/${id}`);
  if (res && typeof res === 'object' && 'data' in res && res.data) {
    return res.data;
  }
  return res as Lecture;
}

/**
 * POST /api/courses/:courseId/lectures
 * Create lecture under a course (Admin only, requires Bearer token)
 */
export async function createLecture(
  courseId: string,
  data: LectureFormData
): Promise<Lecture> {
  const res = await request<ApiResponse<Lecture>>(
    `/courses/${courseId}/lectures`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  if (res.data) return res.data;
  return res as unknown as Lecture;
}

/**
 * PUT /api/lectures/:id
 * Update lecture by ID (Admin only, requires Bearer token)
 */
export async function updateLecture(
  id: string,
  data: Partial<LectureFormData>
): Promise<Lecture> {
  const res = await request<ApiResponse<Lecture>>(`/lectures/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (res.data) return res.data;
  return res as unknown as Lecture;
}

/**
 * DELETE /api/lectures/:id
 * Delete lecture by ID (Admin only, requires Bearer token)
 */
export async function deleteLecture(id: string): Promise<Lecture> {
  const res = await request<ApiResponse<Lecture>>(`/lectures/${id}`, {
    method: 'DELETE',
  });
  if (res.data) return res.data;
  return res as unknown as Lecture;
}

// -------------------------------------------------------------
// Admin Authentication Methods
// -------------------------------------------------------------

/**
 * POST /api/auth/login
 * Authenticate admin with email and password
 */
export async function loginAdmin(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const token = res.token || res.data?.token || '';
  const admin = res.admin || res.data?.admin || {
    username: 'admin',
    email: credentials.email,
  };

  if (!token) {
    throw new Error('Authentication failed: No token received from server.');
  }

  setStoredAuth(token, admin);
  return {
    success: true,
    message: res.message || 'Login successful',
    token,
    admin,
  };
}

// -------------------------------------------------------------
// Backend Health Check
// -------------------------------------------------------------

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
