"use client";

import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import { api, Task } from "@/lib/api";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

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

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Todo App</h1>

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
                className="border border-gray-200 rounded-md p-4"
              >
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                )}
                <div className="text-xs text-gray-400 mt-2 flex gap-4">
                  <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                  {task.due_date && (
                    <span>Due: {new Date(task.due_date).toLocaleString()}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
