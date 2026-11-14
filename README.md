# DataPollex Ltd. Simplified LMS — Frontend Client

A modern, responsive, and secure frontend application for the DataPollex Ltd. Simplified Learning Management System (LMS) recruitment assessment. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Frontend Technologies](#frontend-technologies)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
- [Installation Instructions](#installation-instructions)
- [Environment Configuration (NEXT_PUBLIC_API_URL)](#environment-configuration-next_public_api_url)
- [How to Run the Frontend](#how-to-run-the-frontend)
- [Main Application Pages](#main-application-pages)
- [Backend Connection & Integration Guide](#backend-connection--integration-guide)
- [Admin Authentication & Protected Routes](#admin-authentication--protected-routes)

---

## Project Overview

The DataPollex Simplified LMS Client provides a professional educational portal for students to browse courses and stream video lectures, paired with a protected administration management system to manage courses and lecture content with full CRUD capabilities.

### Key Highlights
- **Zero Mock Data Policy**: All course and lecture data is served live from the Node.js/Express backend API.
- **Strict Route Protection**: All `/admin/*` routes (`/admin/dashboard`, `/admin/courses`, `/admin/lectures`) require active JWT authentication validated against the backend before rendering.
- **Embedded Public Video Player**: Responsive video player supporting YouTube, Vimeo, and direct HTML5 video streams with curriculum playlist navigation.
- **Full Admin CRUD Operations**: Dedicated management interfaces for creating, updating, viewing, and deleting courses and lectures.
- **Resilient UI States**: Polished skeleton loading indicators, contextual empty states, and actionable error alerts with retry triggers.

---

## Frontend Technologies

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) v5
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Icons**: Custom accessible SVG Icon library (zero third-party icon dependencies)
- **Code Quality**: ESLint 9 with `eslint-config-next`

---

## Project Architecture & Directory Structure

```text
lms-client/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── courses/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── lectures/
│   │   │   │   │   │   └── [lectureId]/
│   │   │   │   │   │       └── page.tsx      # Public Lecture Viewing Page with Video Player
│   │   │   │   │   └── page.tsx              # Course Details & Lecture Catalog
│   │   │   │   └── page.tsx                  # Public Courses Listing with Search
│   │   │   ├── lectures/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx              # Direct Lecture Fallback Resolver
│   │   │   ├── layout.tsx                    # Public Layout (Navbar + Main + Footer)
│   │   │   └── page.tsx                      # Student-Facing Home Page
│   │   ├── admin/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── courses/
│   │   │   │   │   └── page.tsx              # Admin Course Management (Create, Read, Update, Delete)
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx              # Admin Dashboard Overview & Metrics
│   │   │   │   ├── lectures/
│   │   │   │   │   └── page.tsx              # Admin Lecture Management (Create, Read, Update, Delete)
│   │   │   │   └── layout.tsx                # Protected Admin Layout (Sidebar, Header, JWT Verification)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                  # Admin Portal Sign In Page
│   │   │   └── page.tsx                      # Admin Entrypoint (Auth Check & Smart Redirect)
│   │   ├── favicon.ico
│   │   ├── globals.css                       # Global styles & Tailwind imports
│   │   └── layout.tsx                        # Root HTML & System Font Provider
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.tsx               # Top bar with live Backend Status Ping & Quick Actions
│   │   │   └── AdminSidebar.tsx              # Navigation sidebar with User Info & Logout
│   │   ├── navigation/
│   │   │   ├── Footer.tsx                    # Public footer with corporate branding
│   │   │   └── Navbar.tsx                    # Top public header with Admin Portal button
│   │   └── ui/
│   │       ├── Badge.tsx                     # Category & status badge pills
│   │       ├── Button.tsx                    # Reusable button with variants & loading states
│   │       ├── CourseCard.tsx                # Course display card matching backend model
│   │       ├── CourseSkeleton.tsx            # Skeleton loaders for grid, list, and detail views
│   │       ├── EmptyState.tsx                # Contextual empty state component with CTAs
│   │       ├── ErrorMessage.tsx              # API error banner with retry triggers
│   │       ├── icons.tsx                     # Lightweight, typed SVG icon collection
│   │       ├── Input.tsx                     # Form input with validation states
│   │       └── VideoPlayer.tsx               # Embedded video player (YouTube, Vimeo, HTML5)
│   ├── lib/
│   │   └── api.ts                            # Centralized API service with Bearer token injection
│   └── types/
│       └── index.ts                          # TypeScript models matching backend MongoDB schemas
├── .env.example                              # Frontend environment variable template
├── .env.local                                # Local environment configuration
├── package.json
└── tsconfig.json
```

---

## Installation Instructions

### Prerequisites
- Node.js (v18.0 or higher)
- npm (Node Package Manager)

### 1. Clone or Open the Repository
```bash
cd c:/projects/lms-client
```

### 2. Install Dependencies
```bash
npm install
```

---

## Environment Configuration (NEXT_PUBLIC_API_URL)

The frontend communicates with the backend via the `NEXT_PUBLIC_API_URL` environment variable.

A template is provided in [.env.example](file:///.env.example):
```env
# DataPollex LMS Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Setup Local Environment
Create `.env.local` in the project root:
```bash
cp .env.example .env.local
```

If your backend is running on a different port or host, update `NEXT_PUBLIC_API_URL` accordingly:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## How to Run the Frontend

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Linting
```bash
# 1. Run ESLint check
npm run lint

# 2. Compile optimized production build
npm run build

# 3. Start production server
npm start
```

---

## Main Application Pages

### Public Student Portal
| Route | Component | Description |
| :--- | :--- | :--- |
| `/` | [src/app/(public)/page.tsx](file:///c:/projects/lms-client/src/app/(public)/page.tsx) | **Home Page**: Features hero banner, platform pillars, and featured courses fetched live from the backend API. |
| `/courses` | [src/app/(public)/courses/page.tsx](file:///c:/projects/lms-client/src/app/(public)/courses/page.tsx) | **Courses Catalog**: Displays all courses with live client-side search filtering. |
| `/courses/[id]` | [src/app/(public)/courses/[id]/page.tsx](file:///c:/projects/lms-client/src/app/(public)/courses/[id]/page.tsx) | **Course Details**: Shows course information, description, price, and the complete list of lectures fetched from `GET /api/courses/:id/lectures`. |
| `/courses/[id]/lectures/[lectureId]` | [src/app/(public)/courses/[id]/lectures/[lectureId]/page.tsx](file:///c:/projects/lms-client/src/app/(public)/courses/[id]/lectures/[lectureId]/page.tsx) | **Public Lecture Viewer**: Embedded video player (YouTube, Vimeo, MP4), next/previous lecture navigation, and course curriculum playlist sidebar. |

### Protected Admin Portal
| Route | Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/admin/login` | [src/app/admin/login/page.tsx](file:///c:/projects/lms-client/src/app/admin/login/page.tsx) | Public | **Admin Sign In**: Authenticates against `POST /api/auth/login`, saves JWT, and redirects to dashboard. |
| `/admin` | [src/app/admin/page.tsx](file:///c:/projects/lms-client/src/app/admin/page.tsx) | Protected | **Admin Root Entry**: Verifies session. Redirects to `/admin/login` if unauthenticated or `/admin/dashboard` if authenticated. |
| `/admin/dashboard` | [src/app/admin/(dashboard)/dashboard/page.tsx](file:///c:/projects/lms-client/src/app/admin/(dashboard)/dashboard/page.tsx) | **Admin Only** | **Admin Dashboard**: Real-time KPI statistics (Total Courses, Total Lectures, API status) and published courses summary. |
| `/admin/courses` | [src/app/admin/(dashboard)/courses/page.tsx](file:///c:/projects/lms-client/src/app/admin/(dashboard)/courses/page.tsx) | **Admin Only** | **Course Management**: Full CRUD interface to Create, Read, Update, and Delete courses with thumbnail preview. |
| `/admin/lectures` | [src/app/admin/(dashboard)/lectures/page.tsx](file:///c:/projects/lms-client/src/app/admin/(dashboard)/lectures/page.tsx) | **Admin Only** | **Lecture Management**: Full CRUD interface to filter by course, add lectures with video URLs, edit, and delete lectures. |

---

## Backend Connection & Integration Guide

### Decoupled API Service ([src/lib/api.ts](file:///c:/projects/lms-client/src/lib/api.ts))
All HTTP requests flow through a unified request wrapper:
- **Base Endpoint**: Reads from `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api`).
- **Authorization Header**: Automatically retrieves the stored JWT and appends `Authorization: Bearer <token>` on all requests.
- **Automatic 401 Session Handling**: If a protected request receives HTTP 401, the invalid token is cleared and the browser is safely redirected to `/admin/login?error=session_expired`.

### Live Backend Status Diagnostic
The Admin Header component ([AdminHeader.tsx](file:///c:/projects/lms-client/src/components/admin/AdminHeader.tsx)) provides a live visual status badge:
- **Green indicator**: Backend is online and responding at `http://localhost:5000/api/health`.
- **Amber indicator**: Backend is offline. Clicking the indicator re-probes backend connectivity without refreshing the page.

---

## Admin Authentication & Protected Routes

### Route Guard Architecture ([src/app/admin/(dashboard)/layout.tsx](file:///c:/projects/lms-client/src/app/admin/(dashboard)/layout.tsx))
1. **Verification on Mount**: When visiting any `/admin/*` route, the client executes `validateAdminSession()`:
   - Verifies that a token exists in browser storage.
   - Decodes the token client-side to verify structure and expiration (`exp`).
   - Probes the backend authentication middleware with the Bearer token.
2. **Blocked Rendering**: Protected admin components are blocked from mounting until authorization is verified.
3. **Redirect Behavior**:
   - Visiting `/admin`, `/admin/dashboard`, `/admin/courses`, or `/admin/lectures` in an Incognito session or without logging in immediately redirects to `/admin/login`.
   - Logging in via `/admin/login` stores the JWT Bearer token and redirects to `/admin/dashboard`.
   - Clicking "Sign Out" in the sidebar clears the stored token and redirects to `/admin/login`.
