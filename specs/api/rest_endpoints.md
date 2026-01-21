# REST API Endpoints
## Base URL
- Development: http://localhost:8000
- Production: https://api.example.com
## Authentication
All endpoints require session cookie (managed by Better Auth).
## Task Endpoints
### GET /api/tasks
List all tasks for authenticated user.
Query Parameters:
- status: "all" | "pending" | "completed"
- sort: "created" | "title" | "due_date"
Response: Array of Task objects

### POST /api/tasks
Create a new task.
Request Body:
- title: string (required)
- description: string (optional)
- due_date: ISO datetime (optional)
Response: Created Task object

### GET /api/tasks/{id}
Get a single task by ID.
Response: Task object

### PUT /api/tasks/{id}
Update a task.
Request Body:
- title: string (optional)
- description: string (optional)
- due_date: ISO datetime (optional)
- completed: boolean (optional)
Response: Updated Task object

### DELETE /api/tasks/{id}
Delete a task.
Response: 204 No Content

### PATCH /api/tasks/{id}/complete
Toggle task completion status.
Response: Updated Task object

## Authentication Endpoints (Better Auth)
These endpoints are managed by Better Auth at `/api/auth/*`:

### POST /api/auth/sign-up/email
Register a new user with email/password.
Request Body:
- email: string (required)
- password: string (required)
- name: string (optional)
Response: User object with session

### POST /api/auth/sign-in/email
Authenticate an existing user.
Request Body:
- email: string (required)
- password: string (required)
Response: User object with session

### POST /api/auth/sign-out
Sign out the current user.
Response: Success message

### GET /api/auth/get-session
Get the current session.
Response: Session object with user data

## User Profile Endpoints

### GET /api/users/me
Retrieve the authenticated user's profile.
Response: User profile object
```json
{
  "id": "string",
  "email": "string",
  "name": "string | null"
}
```

### PUT /api/users/me
Update profile fields for the authenticated user.
Request Body:
- name: string (optional)
Response: Updated User object