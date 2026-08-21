"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { generateQuiz } from "@/lib/api";

export interface QuestionOption {
  option_id: number;
  option_key: "A" | "B" | "C" | "D";
  option_text: string;
}

export interface Question {
  question_id: number;
  question_number: number;
  question_text: string;
  difficulty_level: string;
  options: QuestionOption[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  order_index: number;
}

interface Props {
  onQuizReady: (questions: Question[], title: string, attemptId: number) => void;
}

const FALLBACK_ICONS: Record<string, string> = {
  default: "fluent-emoji:bookmark-tabs",
};

const CARD_COLORS = [
  { bg: "bg-[#eef2ff]", text: "text-[#3b82f6]" },
  { bg: "bg-[#e6f4ea]", text: "text-[#10b981]" },
  { bg: "bg-[#fff7ed]", text: "text-[#f97316]" },
  { bg: "bg-[#fff1f2]", text: "text-[#f43f5e]" },
  { bg: "bg-[#f5f3ff]", text: "text-[#8b5cf6]" },
  { bg: "bg-[#ecfeff]", text: "text-[#06b6d4]" },
];

const keywords = [
  "Software Engineering", "Cybersecurity", "Product Management",
  "Data Science", "Artificial Intelligence", "Cloud Computing",
  "Network Systems", "Technical Support", "Game Development",
  "Digital Design & UX", "Mechatronics",
];

export default function SkillsAssessment({ onQuizReady }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((r) => r.json())
      .then((json) => {
        const list: Category[] = Array.isArray(json) ? json : (json.data ?? []);
        setCategories(list);
      })
      .catch(() => setCatsError("تعذّر تحميل التخصصات، تحقق من تشغيل Laravel."))
      .finally(() => setLoadingCats(false));
  }, []);

  const handleStart = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      const quizData = await generateQuiz(selectedId);
      onQuizReady(
        quizData.questions,
        quizData.category || "Placement Assessment",
        quizData.attempt_id,
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 items-center">

        {/* ---- Categories ---- */}
        <div className="relative p-8 bg-white rounded-3xl border border-[#E4DDF5] shadow-xl shadow-violet-100/50">
          <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none rounded-3xl" />

          {loadingCats && (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400 text-sm">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
              Loading fields...
            </div>
          )}

          {catsError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
              {catsError}
            </div>
          )}

          {!loadingCats && !catsError && (
            <div className="overflow-y-auto pr-2 max-h-[400px] scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-slate-100">
              <div className="flex flex-col gap-3">
                {categories.map((cat, index) => {
                  const color = CARD_COLORS[index % CARD_COLORS.length];
                  const icon = cat.icon || FALLBACK_ICONS.default;
                  const selected = selectedId === cat.id;
                  return (
                    <div key={cat.id} onClick={() => setSelectedId(cat.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 border-2 ${
                        selected
                          ? "border-violet-600 bg-white ring-4 ring-violet-100 scale-[1.02] shadow-md"
                          : `border-white/40 hover:border-violet-300 hover:scale-[1.01] ${color.bg}`
                      }`}
                    >
                      <span className={`text-sm font-bold tracking-wide ${selected ? "text-violet-700" : color.text}`}>
                        {cat.name}
                      </span>
                      <Icon icon={icon} className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 ${selected ? "scale-110" : ""}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ---- Text + Button ---- */}
        <div className="flex flex-col gap-6 text-left lg:pl-6">
          <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Masar Tech Aptitude <br />
              <span className="text-violet-600">Scale & Discovery</span>
            </h1>
            <Icon icon="fluent-emoji:light-bulb" className="w-14 h-14 animate-pulse flex-shrink-0 mt-2 sm:mt-0" />
          </div>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            This assessment helps you discover the perfect tech fields that
            align with your natural analytical abilities and personal interests.
          </p>

          <div className={`transition-all duration-500 overflow-hidden ${selectedId ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              <Icon icon="fluent:info-16-filled" className="w-3 h-3" />
              Please select a domain first to start
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-3 w-3 rounded-full bg-purple-400 animate-pulse" />
              <span>Generating your questions, please wait...</span>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2.5 pt-2 max-w-2xl">
            {keywords.map((kw, i) => (
              <div key={i} className="bg-white hover:bg-violet-50 text-slate-600 hover:text-violet-600 px-4 py-2 rounded-full text-xs font-medium border border-[#E4DDF5] transition-colors cursor-default">
                {kw}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button onClick={handleStart} disabled={!selectedId || loading}
              className={`group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 ${
                selectedId && !loading
                  ? "shadow-[0_16px_36px_rgba(124,58,237,0.28)] hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating questions...
                </>
              ) : selectedId ? (
                <>
                  Start the Exam Now
                  <span className="text-base transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </>
              ) : (
                "Please Select a Field First"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
