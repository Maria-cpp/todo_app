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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cyan-300 neon-glow text-2xl">⏳ Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="neon-border-pink bg-black/30 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-black neon-glow-pink float-animation tracking-wider">
                ⚡ ZUM FLUX AI TODO APP
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-cyan-300 neon-glow px-4 py-2 rounded-full bg-cyan-900/20">
                {session.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-pink-600/80 hover:bg-pink-500 text-white font-semibold transition-all duration-300 neon-glow-pink hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Create New Task */}
          <div className="neon-border-pink bg-black/40 backdrop-blur rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-300 neon-glow mb-6">✨ Create New Task</h2>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>

          {/* Right Column - Your Tasks */}
          <div className="neon-border bg-black/40 backdrop-blur rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-cyan-300 neon-glow mb-6">📋 Your Tasks</h2>
            {isLoading ? (
              <p className="text-cyan-300 neon-glow text-center py-8">⏳ Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-pink-300 neon-glow-pink text-center py-8">🎯 No tasks yet. Create one on the left!</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`border rounded-xl p-4 transition-all duration-300 ${
                      task.completed
                        ? "neon-border bg-green-900/20 border-green-500"
                        : "neon-border bg-black/20 border-cyan-400"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3
                          className={`font-bold text-lg ${
                            task.completed
                              ? "text-green-300 line-through opacity-60"
                              : "text-cyan-300 neon-glow"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-300 text-sm mt-2">
                            {task.description}
                          </p>
                        )}
                        <div className="text-xs text-pink-300 mt-3 flex gap-4">
                          <span>📅 Created: {new Date(task.created_at).toLocaleDateString()}</span>
                          {task.due_date && (
                            <span>⏰ Due: {new Date(task.due_date).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all duration-300 ${
                            task.completed
                              ? "bg-green-600/50 text-green-300 hover:bg-green-600 neon-glow"
                              : "bg-cyan-600/50 text-cyan-300 hover:bg-cyan-600 neon-glow"
                          }`}
                        >
                          {task.completed ? "✓ Undo" : "✔ Complete"}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-xs px-3 py-1 rounded-lg bg-pink-600/50 text-pink-300 hover:bg-pink-600 font-semibold transition-all duration-300 neon-glow-pink"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
