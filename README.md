# Todo App

A full-stack todo application built with FastAPI and Next.js.

## Tech Stack

- **Backend:** FastAPI, SQLModel, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS

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
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   └── lib/             # API client
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

| Method | Endpoint     | Description        |
|--------|-------------|--------------------|
| GET    | /health     | Health check       |
| POST   | /api/tasks  | Create a new task  |
| GET    | /api/tasks  | List all tasks     |

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
```

## Features

- [x] Create tasks (with due date)
- [x] List tasks (with filtering and sorting)
- [ ] Update tasks
- [ ] Delete tasks
- [ ] Mark tasks complete
- [ ] User authentication
