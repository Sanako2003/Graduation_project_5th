"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type AuthFormCardProps = {
  mode: "login" | "register";
};

export default function AuthFormCard({ mode }: AuthFormCardProps) {
  const isLogin = mode === "login";
  const router = useRouter();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/users`;

      const body = isLogin
        ? { email, password }
        : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Laravel validation errors format: { errors: { field: ["msg"] } }
        if (data.errors) {
          const firstError = Object.values(
            data.errors as Record<string, string[]>,
          )[0][0];
          setError(firstError);
        } else {
          setError(data.message || "حدث خطأ، حاول مرة ثانية");
        }
        return;
      }

      if (isLogin) {
        // Update auth context and save token
        setUser(data.user);
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        // After register → go to login
        router.push("/login");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم، تحقق من تشغيل Laravel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F7FB] px-4 py-10 font-sans sm:px-6 lg:px-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fluid-shape-1 {
            0%, 100% { transform: translateY(0px) rotate(12deg) scale(1); }
            50% { transform: translateY(-24px) translateX(12px) rotate(20deg) scale(1.04); }
          }
          @keyframes fluid-shape-2 {
            0%, 100% { transform: translateY(0px) rotate(-10deg) scale(1); }
            50% { transform: translateY(22px) translateX(-16px) rotate(-6deg) scale(0.96); }
          }
          @keyframes fluid-shape-3 {
            0%, 100% { transform: translate(0px, 0px) rotate(45deg); }
            50% { transform: translate(-18px, 14px) rotate(58deg); }
          }
          .animate-fluid-1 { animation: fluid-shape-1 14s ease-in-out infinite; }
          .animate-fluid-2 { animation: fluid-shape-2 16s ease-in-out infinite; }
          .animate-fluid-3 { animation: fluid-shape-3 18s ease-in-out infinite; }
        `,
        }}
      />

      {/* Background shapes */}
      <div className="absolute left-[-40px] top-6 h-72 w-72 rounded-[2.5rem] bg-gradient-to-br from-[#E37D73]/35 to-[#4E37D3]/25 shadow-md animate-fluid-1" />
      <div className="absolute right-[-30px] top-14 h-64 w-64 rounded-[2.2rem] bg-gradient-to-bl from-[#4E37D3]/35 to-[#8B5CF6]/25 shadow-lg animate-fluid-2" />
      <div className="absolute bottom-10 left-[10%] h-48 w-48 rounded-[1.8rem] bg-gradient-to-tr from-[#06B6D4]/30 to-[#10B981]/20 animate-fluid-3" />
      <div className="absolute bottom-[8%] right-[8%] h-56 w-56 rounded-[2rem] bg-gradient-to-bl from-[#F59E0B]/25 to-[#E37D73]/20 animate-fluid-1" />

      <div className="relative z-10 mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/90 p-3 shadow-[0_24px_80px_-24px_rgba(78,55,211,0.30)] backdrop-blur-xl">
        <section className="w-full rounded-[2rem] bg-white p-8 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-500 transition hover:text-purple-600"
            >
              ← Back to home
            </Link>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
              {isLogin ? "Welcome back" : "New here"}
            </span>
          </div>

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {isLogin
                ? "Pick up where you left off and continue your learning path."
                : "Set up your profile and start your learning journey with Masar."}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 rounded-[0.75rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-700"
                  htmlFor="name"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ahmed Khalid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>
            )}

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>

            {!isLogin && (
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-700"
                  htmlFor="role"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[1rem] bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <span>
              {isLogin ? "New to Masar?" : "Already have an account?"}
            </span>
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-semibold text-purple-600 transition hover:text-purple-700"
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
