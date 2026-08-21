"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Mail, Globe, Linkedin, Star, Clock,
  BookOpen, Briefcase, User, Phone, MapPin, Calendar,
  CheckCircle2, Activity, Target,
} from "lucide-react";
import { Github } from "lucide-react";

type Course = {
  id: number; title: string; url: string;
  duration_minutes: number; average_rating: number;
  is_free: number; price: string;
};

type InstructorProfile = {
  id: number; bio: string | null; specialization: string | null;
  linkedin_url: string | null; website_url: string | null;
  years_experience: number; average_rating: number;
  user: { id: number; name: string; email: string; role: string };
  courses: Course[];
};

type StudentSummary = {
  enrolled_courses: number;
  active_courses: number;
  completed_courses: number;
  dropped_courses: number;
  average_progress: number;
  skills: number;
  placement_attempts: number;
};

type StudentEnrollment = {
  id: number;
  enrolled_at: string | null;
  status: "active" | "completed" | "dropped";
  progress_percent: number;
  course: {
    id: number;
    title: string;
    url: string | null;
    thumbnail: string | null;
    language: string | null;
    duration_minutes: number | null;
    average_rating: number | null;
    level: string | null;
    domain: string | null;
  };
};

type StudentSkill = {
  id: number;
  name: string;
  current_score: number;
  last_updated: string | null;
};

type PlacementAttempt = {
  id: number;
  category: string;
  start_time: string | null;
  end_time: string | null;
  total_score: number;
  known_syllabi_count: number;
  status: string;
};

type StudentProfile = {
  id: number; phone: string | null; github_url: string | null;
  country: string | null; birth_date: string | null;
  user: { id: number; name: string; email: string; role: string };
  summary: StudentSummary;
  enrollments: StudentEnrollment[];
  skills: StudentSkill[];
  placement_attempts: PlacementAttempt[];
};

type ProfileData = InstructorProfile | StudentProfile;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function minutesToHours(min: number) {
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h${m > 0 ? " " + m + "m" : ""}` : `${m}m`;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function statusClasses(status: string) {
  if (status === "completed") return "bg-emerald-100 text-emerald-700";
  if (status === "dropped") return "bg-rose-100 text-rose-700";
  return "bg-violet-100 text-violet-700";
}

function isInstructor(p: ProfileData): p is InstructorProfile {
  return p.user.role === "instructor";
}

export default function AdminProfileViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role"); // "student" | "instructor"

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token") ?? localStorage.getItem("access_token") ?? "";
      const headers = { Accept: "application/json", Authorization: `Bearer ${token}` };
      const endpoint = role === "student"
        ? `${API_URL}/student-profiles/${id}`
        : `${API_URL}/instructor-profiles/${id}`;
      try {
        setLoading(true);
        const res = await fetch(endpoint, { headers });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.message ?? `Unable to load profile (${res.status})`);
        }
        const json = await res.json();
        setProfile(json.data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id, role]);

  if (loading) return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
        <p className="text-slate-500 font-medium">Loading profile...</p>
      </div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-rose-500 font-bold text-lg">{error || "Profile not found"}</p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:underline">
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    </div>
  );

  const instructor = isInstructor(profile) ? profile : null;
  const student = !isInstructor(profile) ? (profile as StudentProfile) : null;
  const studentSummary = student?.summary ?? {
    enrolled_courses: 0,
    active_courses: 0,
    completed_courses: 0,
    dropped_courses: 0,
    average_progress: 0,
    skills: 0,
    placement_attempts: 0,
  };
  const enrollments = student?.enrollments ?? [];
  const studentSkills = student?.skills ?? [];
  const placementAttempts = student?.placement_attempts ?? [];
  const uniqueCourses = instructor
    ? Array.from(new Map(instructor.courses.map((c) => [c.id, c])).values())
    : [];

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-600 pt-10 pb-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-8 transition">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 pb-16 relative z-10 space-y-6">

        {/* Profile card */}
        <div className="bg-white rounded-3xl shadow-xl border border-white/60 p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0">
              {getInitials(profile.user.name)}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-800">{profile.user.name}</h1>
                <span className={`self-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  instructor ? "bg-fuchsia-100 text-fuchsia-700" : "bg-violet-100 text-violet-700"
                }`}>{profile.user.role}</span>
              </div>
              {instructor?.specialization && <p className="text-slate-500 font-medium">{instructor.specialization}</p>}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
                <a href={`mailto:${profile.user.email}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition">
                  <Mail size={14} /> {profile.user.email}
                </a>
                {instructor?.linkedin_url && (
                  <a href={instructor.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition">
                    <Linkedin size={14} /> LinkedIn
                  </a>
                )}
                {instructor?.website_url && (
                  <a href={instructor.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition">
                    <Globe size={14} /> Website
                  </a>
                )}
                {student?.phone && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><Phone size={14} /> {student.phone}</span>
                )}
                {student?.github_url && (
                  <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition">
                    <Github size={14} /> GitHub
                  </a>
                )}
                {student?.country && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} /> {student.country}</span>
                )}
                {student?.birth_date && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><Calendar size={14} /> {student.birth_date}</span>
                )}
              </div>
            </div>
          </div>
          {instructor?.bio && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-slate-600 leading-relaxed">{instructor.bio}</p>
            </div>
          )}
        </div>

        {/* Stats — instructor only */}
        {instructor && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Avg Rating", value: instructor.average_rating.toFixed(1), icon: Star, bg: "bg-amber-100", color: "text-amber-500" },
              { label: "Years Exp.", value: instructor.years_experience, icon: Briefcase, bg: "bg-violet-100", color: "text-violet-600" },
              { label: "Courses", value: uniqueCourses.length, icon: BookOpen, bg: "bg-emerald-100", color: "text-emerald-600" },
            ].map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className="bg-white rounded-2xl shadow-md border border-white/60 p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats — student only */}
        {student && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Enrolled Courses", value: studentSummary.enrolled_courses, icon: BookOpen, bg: "bg-violet-100", color: "text-violet-600" },
              { label: "Completed", value: studentSummary.completed_courses, icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600" },
              { label: "Average Progress", value: `${studentSummary.average_progress}%`, icon: Activity, bg: "bg-blue-100", color: "text-blue-600" },
              { label: "Placement Tests", value: studentSummary.placement_attempts, icon: Target, bg: "bg-fuchsia-100", color: "text-fuchsia-600" },
            ].map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className="bg-white rounded-2xl shadow-md border border-white/60 p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-400 font-medium truncate">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses — instructor only */}
        {instructor && uniqueCourses.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-white/60 p-6">
            <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
              <BookOpen size={18} className="text-violet-600" /> Courses Taught
            </h2>
            <div className="space-y-3">
              {uniqueCourses.map((course) => (
                <a key={course.id} href={course.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-2xl border border-slate-100 bg-slate-50 hover:bg-violet-50 hover:border-violet-200 p-4 transition group">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-slate-800 text-sm group-hover:text-violet-700 transition line-clamp-2">{course.title}</p>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Star size={10} /> {course.average_rating}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={10} /> {minutesToHours(course.duration_minutes)}
                      </span>
                    </div>
                  </div>
                  <span className={`mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                    course.is_free ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"
                  }`}>{course.is_free ? "Free" : `$${course.price}`}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Enrolled courses — student only */}
        {student && (
          <div className="bg-white rounded-3xl shadow-xl border border-white/60 p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <BookOpen size={18} className="text-violet-600" /> Enrolled Courses
              </h2>
              <span className="text-xs font-bold text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
                {enrollments.length} courses
              </span>
            </div>

            {enrollments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {enrollments.map((enrollment) => {
                  const progress = Math.max(0, Math.min(100, enrollment.progress_percent ?? 0));
                  return (
                    <div key={enrollment.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-800 line-clamp-2">{enrollment.course.title}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                            {enrollment.course.domain && <span>{enrollment.course.domain}</span>}
                            {enrollment.course.level && <span>• {enrollment.course.level}</span>}
                            {enrollment.course.language && <span>• {enrollment.course.language}</span>}
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClasses(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-violet-700">{progress}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span>Enrolled {formatDate(enrollment.enrolled_at)}</span>
                        {enrollment.course.duration_minutes != null && (
                          <span className="inline-flex items-center gap-1"><Clock size={11} /> {minutesToHours(enrollment.course.duration_minutes)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                This student is not enrolled in any courses yet.
              </div>
            )}
          </div>
        )}

        {/* Skills — student only */}
        {student && (
          <div className="bg-white rounded-3xl shadow-xl border border-white/60 p-6">
            <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
              <Activity size={18} className="text-blue-600" /> Skill Matrix
            </h2>
            {studentSkills.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {studentSkills.map((skill) => {
                  const score = Math.max(0, Math.min(100, skill.current_score ?? 0));
                  return (
                    <div key={skill.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-bold text-slate-700">{skill.name}</span>
                        <span className="text-sm font-extrabold text-blue-600">{score}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                No skill scores are available for this student yet.
              </div>
            )}
          </div>
        )}

        {/* Placement attempts — student only */}
        {student && (
          <div className="bg-white rounded-3xl shadow-xl border border-white/60 p-6">
            <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
              <Target size={18} className="text-fuchsia-600" /> Placement Test Attempts
            </h2>
            {placementAttempts.length > 0 ? (
              <div className="space-y-3">
                {placementAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{attempt.category}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(attempt.end_time ?? attempt.start_time)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {attempt.known_syllabi_count} known topics
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                        Score: {attempt.total_score}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${attempt.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                        {attempt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                No placement test attempts are available for this student yet.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <User size={14} />
          <span>View only — editing is not available from this page</span>
        </div>
      </div>
    </div>
  );
}
