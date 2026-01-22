"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { api, Task } from "@/lib/api";
import { useSession, signOut } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      loadTasks();
    }
  }, [session]);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const updatedTask = await api.toggleTaskComplete(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (isPending) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{session.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Task</h2>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Create one above!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`border rounded-md p-4 ${
                  task.completed
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-400 mt-2 flex gap-4">
                      <span>
                        Created: {new Date(task.created_at).toLocaleDateString()}
                      </span>
                      {task.due_date && (
                        <span>Due: {new Date(task.due_date).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`text-xs px-2 py-1 rounded ${
                        task.completed
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
