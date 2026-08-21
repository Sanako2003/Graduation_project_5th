"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseDetailsClient from "../../../components/CourseComponent/CourseDetailsClient";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Module {
  id: number;
  name: string;
  title?: string;
  duration_minutes?: number;
  order_index?: number;
  order?: number;
}

export interface LearningOutcome {
  id: number;
  outcome: string; // عدّل هنا لو اسم الحقل مختلف في LearningOutcomeResource
}

export interface CourseData {
  id: number;
  title: string;
  url: string;
  description: string | null;
  price: number | null;
  is_free: boolean;
  duration_minutes: number;
  average_rating: number;
  students_count?: number;
  domain?: { id: number; name: string };
  level?: { id: number; name: string };
  type?: { id: number; name: string };
  categories?: { id: number; name: string }[];
  instructors?: { id: number; name: string; avatar?: string }[];
  organizations?: { id: number; name: string }[];
  prerequisites?: CourseData[];
  modules?: Module[];
  skills?: { id: number; name: string }[];
  learning_outcomes?: LearningOutcome[];
  enrollment?: {
    enrolled_at: string;
    status: string;
    progress_percent: number;
  } | null;
  similarity_score?: number;
}

interface ApiResponse {
  data: CourseData;
}

// ── Config ────────────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function fetchCourse(id: string): Promise<CourseData> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
    headers,
    // credentials: "include", // فعّل هنا لو بتستخدم Cookie-based auth
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`(${res.status}) ${text || res.statusText}`);
  }

  const json: ApiResponse = await res.json();
  return json.data;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DynamicCoursePage() {
  const params = useParams();
  const courseId = params?.id ? String(params.id) : "";

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!courseId) return;
    setLoading(true);
    setError(null);

    fetchCourse(courseId)
      .then(setCourseData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-[#F7F5FF]">
        <div className="w-10 h-10 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-violet-600 font-semibold">Loading course details…</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-[#F7F5FF] px-4">
        <p className="text-red-500 font-bold text-lg">
          ⚠️ Failed to load course
        </p>
        <p className="text-slate-500 text-sm text-center max-w-md">{error}</p>
        <button
          onClick={load}
          className="mt-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#F7F5FF]">
        <p className="text-slate-400">Course not found.</p>
      </div>
    );
  }

  return <CourseDetailsClient course={courseData} />;
}
