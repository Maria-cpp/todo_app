"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User | null;
  error?: { message: string };
}

export interface UseSessionReturn {
  data: User | null;
  isPending: boolean;
  error?: { message: string };
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { user: null, error: { message: error.detail || "Login failed" } };
    }

    const user = await response.json();
    return { user, error: undefined };
  } catch (err) {
    return { user: null, error: { message: "Network error" } };
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { user: null, error: { message: error.detail || "Sign up failed" } };
    }

    const user = await response.json();
    return { user, error: undefined };
  } catch (err) {
    return { user: null, error: { message: "Network error" } };
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
}

export async function getSession(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return { user: null };
    }

    const data = await response.json();
    return { user: data.user };
  } catch (err) {
    return { user: null };
  }
}

export function useSession(): UseSessionReturn {
  const [data, setData] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<{ message: string }>();

  useEffect(() => {
    const fetchSession = async () => {
      setIsPending(true);
      const response = await getSession();
      setData(response.user);
      setError(response.error);
      setIsPending(false);
    };

    fetchSession();
  }, []);

  return { data, isPending, error };
}
