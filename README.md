# Nextjs-authentication

A complete, production-ready Full-Stack Login and Signup Authentication System built with Next.js (App Router), TypeScript, MongoDB Atlas, Mongoose, and JWT.

## Features

- **Signup**:
  - Full Name, Email, Password, and Confirm Password fields
  - Strong Zod validation and client/server checks
  - Duplicate email checking
  - Password hashing with `bcryptjs`
  - Automatic authentication and redirect to dashboard upon registration
- **Login**:
  - Email and password verification
  - Show/hide password toggles
  - Safe error messages preventing account enumeration
  - JWT token generation stored in secure `HTTP-only` cookies
- **Protected Dashboard**:
  - Server-side route protection (unauthenticated users redirected to `/login`)
  - Displays authenticated user's name, email, and registration date
  - Modern card-based UI with statistics and activity overview
- **Sidebar & Logout**:
  - User profile section with initials avatar
  - Secure logout endpoint that clears authentication cookies and redirects to login
- **Security**:
  - HTTP-only, secure, SameSite cookies
  - Passwords hashed with bcryptjs (salt factor 12)
  - Rate limiting on authentication API endpoints
  - Strict input sanitization with Zod

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT (`jsonwebtoken`) & HTTP-Only Cookies
- **Security**: `bcryptjs` & custom rate limiter
- **Validation**: Zod
- **Styling**: Tailwind CSS & Lucide React icons

## Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> **Note**: `.env` and `.env.local` are excluded via `.gitignore` to protect sensitive credentials.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
