const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── خطوة 1: جيب التوبيكس من Laravel ──
// POST /placement-test/{categoryId}
// Response: { category: string, placement_topics: string[] }
export async function fetchPlacementTopics(categoryId: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/placement-test/${categoryId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error || err.message || "فشل تحميل المواضيع من Laravel",
    );
  }
  return res.json() as Promise<{
    category: string;
    placement_topics: string[];
  }>;
}

// ── خطوة 2: ولّد الأسئلة ──
// POST /placement/generate
// Body: { category: string, placement_topics: string[] }
// Response: { questions: [...], category?: string, attempt_id?: number }
export interface GenerateQuizPayload {
  category: string;
  placement_topics: string[];
}

function normalizeQuestion(rawQuestion: any) {
  const options = Array.isArray(rawQuestion?.options)
    ? rawQuestion.options.map((option: any) => ({
        option_id: option.option_id ?? 0,
        option_key: option.option_key ?? "A",
        option_text: option.option_text ?? "",
      }))
    : Object.entries(rawQuestion?.options ?? {}).map(([key, value]) => ({
        option_id: 0,
        option_key: key,
        option_text: String(value),
      }));

  return {
    question_id: rawQuestion?.question_id ?? 0,
    question_number: rawQuestion?.question_number ?? 1,
    question_text: rawQuestion?.question_text ?? "",
    difficulty_level: rawQuestion?.difficulty_level ?? "Beginner",
    options,
  };
}

export async function generateQuiz(categoryId: number) {
  const res = await fetch(`${API_BASE}/placement/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ category_id: categoryId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "فشل توليد الأسئلة من الخادم");
  }

  const data = await res.json();
  return {
    ...data,
    questions: Array.isArray(data?.questions)
      ? data.questions.map(normalizeQuestion)
      : [],
  };
}
// ── تسليم الإجابات ──
export interface SubmitAnswer {
  question_id: number;
  selected_option_id: number;
}

export interface Recommendation {
  rank: number;
  course_title: string;
  score: number;
}

export interface SubmitResult {
  message: string;
  score: number;
  total: number;
  known_syllabi: string[];
  recommendations: Recommendation[];
}

export async function submitQuiz(
  attemptId: number,
  answers: SubmitAnswer[],
): Promise<SubmitResult> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/placement/${attemptId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ answers }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "فشل تسليم الإجابات");
  }

  return res.json();
}