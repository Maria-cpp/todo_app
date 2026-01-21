# Feature: User Authentication

## Overview
User authentication using Better Auth with email/password login.

## User Stories
- As a user, I can sign up with email and password
- As a user, I can log in with my credentials
- As a user, I can log out
- As a user, I can only see my own tasks

## Acceptance Criteria

### Sign Up
- Email must be valid format
- Password minimum 8 characters
- Redirect to tasks page after successful signup

### Login
- Show error for invalid credentials
- Redirect to tasks page after successful login
- Persist session across page refreshes

### Protected Routes
- Redirect to login if not authenticated
- API endpoints require valid JWT token

## Technical Notes
- Frontend: Better Auth with Next.js
- Backend: JWT token verification
- Session stored in cookies (httpOnly)
