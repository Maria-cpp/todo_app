# Todo App

A full-stack todo application built with FastAPI and Next.js.

## Tech Stack

- **Backend:** FastAPI, SQLModel, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Auth:** Better Auth (email/password)

## Project Structure

```
hackathon-todo/
├── backend/
│   ├── main.py          # FastAPI entry point
│   ├── db.py            # Database connection
│   ├── models.py        # SQLModel models
│   ├── routes/          # API route handlers
│   └── .env             # Environment variables
├── frontend/
│   ├── app/             # Next.js pages (login, home)
│   ├── components/      # React components
│   └── lib/             # API client, auth config
├── specs/               # Feature specifications
└── venv/                # Python virtual environment
```

## Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE todo;
```

2. Initialize Better Auth tables (from frontend directory):
```bash
cd frontend
npm install
npm run db:migrate
```

3. Application tables (tasks) are created automatically when the backend starts.

### Backend

```bash
# Activate virtual environment
# Windows:
.\venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Run the server
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Task Endpoints (Backend)

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /health                   | Health check             |
| POST   | /api/tasks                | Create a new task        |
| GET    | /api/tasks                | List all tasks           |
| GET    | /api/tasks/{id}           | Get a single task        |
| PUT    | /api/tasks/{id}           | Update a task            |
| DELETE | /api/tasks/{id}           | Delete a task            |
| PATCH  | /api/tasks/{id}/complete  | Toggle task complete     |

### User Endpoints (Backend)

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/users/me             | Get current user profile |
| PUT    | /api/users/me             | Update user profile      |

### Auth Endpoints (Better Auth - Frontend)

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/auth/sign-up/email   | Register new user        |
| POST   | /api/auth/sign-in/email   | Login user               |
| POST   | /api/auth/sign-out        | Logout user              |
| GET    | /api/auth/get-session     | Get current session      |

### POST /api/tasks

Request body:
- `title`: string (required, 1-200 chars)
- `description`: string (optional, max 1000 chars)
- `due_date`: ISO datetime string (optional)

Example:
```json
{
  "title": "Complete project",
  "description": "Finish the todo app",
  "due_date": "2024-12-31T23:59:00"
}
```

### GET /api/tasks

Query parameters:
- `status`: Filter by status - `all` | `pending` | `completed` (default: `all`)
- `sort`: Sort order - `created` | `title` | `due_date` (default: `created`)

Example:
```
GET /api/tasks?status=pending&sort=title
```

## Environment Variables

### Backend (`backend/.env`)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-change-in-production
```

## Features

- [x] Create tasks (with due date)
- [x] List tasks (with filtering and sorting)
- [x] User authentication (login/signup)
- [x] Update tasks
- [x] Delete tasks
- [x] Mark tasks complete
