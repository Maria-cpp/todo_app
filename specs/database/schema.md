# Database Schema

## Tables

### Better Auth Tables (auto-managed)
These tables are created and managed by Better Auth:

#### user
- id: string (primary key)
- email: string (unique)
- name: string (nullable)
- emailVerified: boolean
- image: string (nullable)
- createdAt: timestamp
- updatedAt: timestamp

#### session
- id: string (primary key)
- userId: string (foreign key -> user.id)
- token: string (unique)
- expiresAt: timestamp
- ipAddress: string (nullable)
- userAgent: string (nullable)
- createdAt: timestamp
- updatedAt: timestamp

#### account
- id: string (primary key)
- userId: string (foreign key -> user.id)
- accountId: string
- providerId: string
- accessToken: string (nullable)
- refreshToken: string (nullable)
- expiresAt: timestamp (nullable)
- password: string (nullable, for email/password auth)
- createdAt: timestamp
- updatedAt: timestamp

#### verification
- id: string (primary key)
- identifier: string
- value: string
- expiresAt: timestamp
- createdAt: timestamp
- updatedAt: timestamp

### Application Tables

#### tasks
- id: integer (primary key, auto-increment)
- user_id: string (foreign key -> user.id)
- title: string (not null, max 200)
- description: text (nullable, max 1000)
- due_date: timestamp (nullable)
- completed: boolean (default false)
- created_at: timestamp
- updated_at: timestamp

## Indexes
- tasks.user_id (for filtering by user)
- tasks.completed (for status filtering)

## Setup
1. Better Auth tables: Run `npx @better-auth/cli generate` then `npx @better-auth/cli migrate`
2. Application tables: Created automatically by SQLModel on backend startup