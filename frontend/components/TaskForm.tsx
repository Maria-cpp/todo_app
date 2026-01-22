"use client";

import { useState } from "react";
import { api, Task } from "@/lib/api";

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.length > 200) {
      setError("Title must be 200 characters or less");
      return;
    }

    if (description.length > 1000) {
      setError("Description must be 1000 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      const task = await api.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
      });
      onTaskCreated(task);
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-cyan-300 neon-glow mb-2">
          📌 Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="w-full rounded-lg border border-cyan-500/50 bg-black/40 px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          placeholder="Enter task title"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-pink-300">{title.length}/200</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-cyan-300 neon-glow mb-2">
          📝 Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full rounded-lg border border-cyan-500/50 bg-black/40 px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
          placeholder="Enter task description (optional)"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-pink-300">{description.length}/1000</p>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-semibold text-cyan-300 neon-glow mb-2">
          ⏰ Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg border border-cyan-500/50 bg-black/40 px-4 py-2 text-cyan-300 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          style={{
            colorScheme: 'dark',
          }}
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p className="text-sm text-pink-400 neon-glow-pink bg-pink-900/20 px-4 py-2 rounded-lg">🚨 {error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-pink-600 px-4 py-3 text-white font-bold hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 neon-glow"
      >
        {isSubmitting ? "✨ Creating..." : "🚀 Create Task"}
      </button>
    </form>
  );
}
