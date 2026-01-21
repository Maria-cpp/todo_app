const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface UpdateUserInput {
  name?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    return this.request<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTasks(
    status: "all" | "pending" | "completed" = "all",
    sort: "created" | "title" | "due_date" = "created"
  ): Promise<Task[]> {
    return this.request<Task[]>(`/api/tasks?status=${status}&sort=${sort}`);
  }

  async getTask(id: number): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`);
  }

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  async toggleTaskComplete(id: number): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/complete`, {
      method: "PATCH",
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/users/me");
  }

  async updateCurrentUser(data: UpdateUserInput): Promise<User> {
    return this.request<User>("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
