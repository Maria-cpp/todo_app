"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message || "Login failed");
          return;
        }
      } else {
        const result = await signUp(email, password, name);
        if (result.error) {
          setError(result.error.message || "Sign up failed");
          return;
        }
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="neon-border-pink bg-black/50 backdrop-blur rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-4xl font-black text-center mb-8 neon-glow-pink tracking-wider">
          {isLogin ? "⚡ LOGIN" : "✨ SIGN UP"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-cyan-300 neon-glow mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-cyan-500/50 bg-black/40 px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="Your full name"
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-cyan-300 neon-glow mb-2">
              📧 Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-cyan-500/50 bg-black/40 px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-cyan-300 neon-glow mb-2">
              🔐 Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-cyan-500/50 bg-black/40 px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Minimum 8 characters"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-pink-400 neon-glow-pink bg-pink-900/30 px-4 py-3 rounded-lg">🚨 {error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-pink-600 px-4 py-3 text-white font-bold hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 neon-glow text-lg"
          >
            {isLoading ? "⏳ Loading..." : isLogin ? "🚀 LOGIN" : "🎉 SIGN UP"}
          </button>
        </form>

        <div className="mt-6 p-4 border-t border-cyan-500/30">
          <p className="text-center text-sm text-gray-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-pink-300 neon-glow-pink hover:text-pink-200 font-semibold transition-colors"
            >
              {isLogin ? "Sign Up Now" : "Login Now"}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-cyan-400/60">
          Welcome to ZUM FLUX AI TODO APP ✨
        </div>
      </div>
    </div>
  );
}
