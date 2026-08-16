"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

// Local types (mirror server response shape used by the page)
type Module = { id: number; name: string; duration_minutes?: number; order_index?: number };
type LearningOutcome = { id: number; outcome: string };
type Skill = { id: number; name: string };
type Instructor = { id: number; name: string; avatar?: string };
type Prerequisite = { id: number; title: string };

type CourseData = {
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
  instructors?: Instructor[];
  organizations?: { id: number; name: string }[];
  prerequisites?: Prerequisite[];
  modules?: Module[];
  skills?: Skill[];
  learning_outcomes?: LearningOutcome[];
  enrollment?: { enrolled_at: string; status: string; progress_percent: number } | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** تحويل الدقائق لصيغة مقروءة: 90 → "1h 30m" */
function formatDuration(minutes?: number): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** نجوم التقييم */
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          icon={
            i < Math.floor(rating)
              ? "fluent:star-24-filled"
              : i < rating
              ? "fluent:star-half-24-filled"
              : "fluent:star-24-regular"
          }
          className="w-4 h-4 text-amber-400"
        />
      ))}
      <span className="ml-1 text-sm font-bold text-amber-500">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CourseDetailsClient({
  course,
}: {
  course: CourseData | null;
}) {
  const router = useRouter();
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

  if (!course) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        No Course Data Available
      </div>
    );
  }

  // الـ module النشط (أول واحد افتراضياً)
  const firstModule = course.modules?.[0] ?? null;
  const currentModuleId =
    activeModuleId ?? firstModule?.id ?? null;

  // Progress من الـ enrollment (لو الطالب مسجّل)
  const progressPercentage = course.enrollment?.progress_percent ?? 0;

  // عنوان الـ category: نأخذ أول category أو الـ domain كبديل
  const categoryLabel =
    course.categories?.[0]?.name ?? course.domain?.name ?? "Course";

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      {/* ── زر العودة ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => router.push("/courses")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 font-medium text-sm transition-colors"
        >
          <Icon icon="fluent:arrow-left-24-filled" className="w-4 h-4" />
          Back to Courses
        </button>
      </div>

      {/* ── Layout ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* ══ العمود الأيسر ═══════════════════════════════════════════════ */}
        <div className="flex flex-col gap-8">

          {/* البانر */}
          <div className="relative w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 rounded-[2.5rem] p-8 md:p-14 overflow-hidden min-h-[300px] flex flex-col justify-center shadow-lg">
            {/* Badge */}
            <span className="bg-white/20 backdrop-blur text-white text-xs font-black px-4 py-1.5 rounded-full w-fit mb-4 border border-white/30">
              {categoryLabel}
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {course.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              {course.level && (
                <span className="flex items-center gap-1.5">
                  <Icon icon="fluent:trophy-24-filled" className="w-4 h-4" />
                  {course.level.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Icon icon="fluent:clock-24-filled" className="w-4 h-4" />
                {formatDuration(course.duration_minutes)}
              </span>
              {course.students_count !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Icon icon="fluent:people-24-filled" className="w-4 h-4" />
                  {course.students_count.toLocaleString()} students
                </span>
              )}
              {course.average_rating > 0 && (
                <StarRating rating={course.average_rating} />
              )}
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  course.is_free
                    ? "bg-emerald-400/30 text-emerald-100"
                    : "bg-amber-400/30 text-amber-100"
                }`}
              >
                {course.is_free
                  ? "Free"
                  : course.price != null
                  ? `$${course.price}`
                  : "Paid"}
              </span>
            </div>
          </div>

          {/* About + Learning Outcomes */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 border-l-4 border-purple-600 pl-3 mb-3">
              About this Course
            </h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              {course.description ?? "No description available."}
            </p>

            {/* Learning Outcomes */}
            {course.learning_outcomes && course.learning_outcomes.length > 0 && (
              <>
                <h3 className="text-lg font-extrabold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">
                  What you will learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learning_outcomes.map((lo: LearningOutcome) => (
                    <div
                      key={lo.id}
                      className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl"
                    >
                      <Icon
                        icon="fluent:checkmark-circle-24-filled"
                        className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-slate-600 font-medium">
                        {lo.outcome}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Skills */}
            {course.skills && course.skills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-extrabold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">
                  Skills you'll gain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((s: Skill) => (
                    <span
                      key={s.id}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instructors */}
            {course.instructors && course.instructors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-extrabold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">
                  Instructors
                </h3>
                <div className="flex flex-wrap gap-3">
                  {course.instructors.map((inst: Instructor) => (
                    <div
                      key={inst.id}
                      className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
                        {inst.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {inst.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-extrabold text-slate-900 border-l-4 border-amber-400 pl-3 mb-4">
                  Prerequisites
                </h3>
                <ul className="flex flex-col gap-2">
                  {course.prerequisites.map((p: Prerequisite) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <Icon
                        icon="fluent:link-24-filled"
                        className="w-4 h-4 text-amber-500"
                      />
                      {p.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ══ العمود الأيمن: Modules ═══════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-6">

          {/* Enrollment status */}
          {course.enrollment ? (
            <>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>Your Progress</span>
                <span className="text-purple-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mb-5 capitalize">
                Status: {course.enrollment.status}
              </p>
            </>
          ) : (
            <div className="mb-5">
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-2xl transition"
              >
                <Icon icon="fluent:open-24-filled" className="w-4 h-4" />
                Go to Course
              </a>
            </div>
          )}

          {/* Modules list */}
          <h4 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wide">
            Course Modules
          </h4>

          {course.modules && course.modules.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {course.modules
                .slice()
                .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                .map((mod: Module) => {
                  const isActive = currentModuleId === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModuleId(mod.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? "bg-purple-50 border-purple-200 text-purple-700 font-bold"
                          : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon
                          icon={
                            isActive
                              ? "fluent:play-circle-24-filled"
                              : "fluent:play-circle-24-regular"
                          }
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? "text-purple-500" : "text-slate-400"
                          }`}
                        />
                        <span className="text-sm truncate">{mod.name}</span>
                      </div>
                      {mod.duration_minutes != null && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">
                          {formatDuration(mod.duration_minutes)}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">
              No modules available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}