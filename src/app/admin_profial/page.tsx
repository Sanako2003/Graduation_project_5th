"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Clock3,
  GraduationCap,
  Mail,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  students: number;
  hours: number;
  lessons: number;
  rating: number;
  color: string;
  iconBg: string;
};

type Instructor = {
  id: number;
  userId: number;
  name: string;
  email: string;
  initials: string;
  title: string;
  department: string;
  location: string;
  joined: string;
  experience: string;
  rating: number;
  students: number;
  teachingHours: number;
  bio: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const emptyInstructor: Instructor = {
  id: 0,
  userId: 0,
  name: "Instructor",
  email: "—",
  initials: "IN",
  title: "Instructor",
  department: "—",
  location: "—",
  joined: "—",
  experience: "0 Years",
  rating: 0,
  students: 0,
  teachingHours: 0,
  bio: "No biography available.",
};

const courseStyles = [
  ["from-violet-500 to-purple-600", "bg-violet-50 text-violet-600"],
  ["from-cyan-500 to-blue-600", "bg-cyan-50 text-cyan-600"],
  ["from-emerald-500 to-teal-600", "bg-emerald-50 text-emerald-600"],
  ["from-orange-500 to-rose-500", "bg-orange-50 text-orange-600"],
];

function mapCourse(course: any): Course {
  const style = courseStyles[Number(course.id ?? 0) % courseStyles.length];

  return {
    id: Number(course.id),
    title: course.title ?? "Untitled course",
    category: course.domain?.name ?? "—",
    level: course.level?.name ?? "—",
    students: Number(course.students_count ?? 0),
    hours: Math.round(Number(course.duration_minutes ?? 0) / 60),
    lessons: Number(course.modules_count ?? course.modules?.length ?? 0),
    rating: Number(course.average_rating ?? 0),
    color: style[0],
    iconBg: style[1],
  };
}

function getHeaders(withJson = false): Record<string, string> {
  const token = localStorage.getItem("token") ?? localStorage.getItem("access_token") ?? "";
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  if (withJson) headers["Content-Type"] = "application/json";
  return headers;
}

async function readError(response: Response) {
  const payload = await response.json().catch(() => null);
  return payload?.message ?? `Request failed (${response.status})`;
}

export default function InstructorProfilePage() {
  const [instructor, setInstructor] = useState<Instructor>(emptyInstructor);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  const totalStudents = useMemo(
    () => courses.reduce((sum, course) => sum + course.students, 0),
    [courses]
  );

  const remainingCourses = useMemo(
    () => availableCourses.filter(
      (course) => !courses.some((assigned) => assigned.id === course.id)
    ),
    [availableCourses, courses]
  );

  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflowY = "auto";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflowY = "";
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInstructor() {
      const token = localStorage.getItem("token") ?? localStorage.getItem("access_token");
      if (!token) {
        setError("Your session has expired. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_URL}/instructor/me`, {
          headers: getHeaders(),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(await readError(response));

        const payload = await response.json();
        const profile = payload.data ?? payload;
        const name = profile.user?.name ?? "Instructor";
        const realCourses = (profile.courses ?? []).map(mapCourse);

        setInstructor({
          id: Number(profile.id),
          userId: Number(profile.user?.id),
          name,
          email: profile.user?.email ?? "—",
          initials: name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase(),
          title: `${profile.specialization ?? "Professional"} Instructor`,
          department: profile.specialization ?? "—",
          location: "—",
          joined: "—",
          experience: `${profile.years_experience ?? 0} Years`,
          rating: Number(profile.average_rating ?? 0),
          students: realCourses.reduce((sum: number, course: Course) => sum + course.students, 0),
          teachingHours: realCourses.reduce((sum: number, course: Course) => sum + course.hours, 0),
          bio: profile.bio ?? "No biography available.",
        });
        setCourses(realCourses);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          setError((requestError as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadInstructor();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!showAddCourse) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setAvailableLoading(true);
        setActionError("");
        const query = new URLSearchParams({
          per_page: "50",
          sort: "title",
        });
        if (courseSearch.trim()) query.set("search", courseSearch.trim());

        const response = await fetch(`${API_URL}/courses?${query.toString()}`, {
          headers: getHeaders(),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(await readError(response));
        const payload = await response.json();
        setAvailableCourses((payload.data ?? []).map(mapCourse));
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          setActionError((requestError as Error).message);
        }
      } finally {
        setAvailableLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [showAddCourse, courseSearch]);

  useEffect(() => {
    if (!showAddCourse) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showAddCourse]);

  async function removeCourse(course: Course) {
    try {
      setActionLoading(`remove-${course.id}`);
      setActionError("");
      const response = await fetch(
        `${API_URL}/course-instructors/${course.id}/${instructor.userId}`,
        { method: "DELETE", headers: getHeaders() }
      );

      if (!response.ok) throw new Error(await readError(response));
      setCourses((current) => current.filter((item) => item.id !== course.id));
      setAvailableCourses((current) => [course, ...current]);
    } catch (requestError) {
      setActionError((requestError as Error).message);
    } finally {
      setActionLoading("");
    }
  }

  async function addCourse(course: Course) {
    try {
      setActionLoading(`add-${course.id}`);
      setActionError("");
      const response = await fetch(`${API_URL}/course-instructors`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          course_id: course.id,
          user_id: instructor.userId,
        }),
      });

      if (!response.ok) throw new Error(await readError(response));
      setCourses((current) => current.some((item) => item.id === course.id)
        ? current
        : [...current, course]);
      setAvailableCourses((current) => current.filter((item) => item.id !== course.id));
    } catch (requestError) {
      setActionError((requestError as Error).message);
    } finally {
      setActionLoading("");
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F4F7FB] pb-20 font-sans text-slate-800">
      {loading && <div className="fixed inset-0 z-[200] grid place-items-center bg-white/70 text-violet-700 font-bold backdrop-blur-sm">Loading instructor profile...</div>}
      {error && <div className="relative z-[201] mx-auto mt-4 max-w-3xl rounded-2xl bg-rose-50 px-5 py-4 text-center font-semibold text-rose-700">{error}</div>}
      {actionError && !showAddCourse && <div className="relative z-[201] mx-auto mt-4 max-w-3xl rounded-2xl bg-rose-50 px-5 py-4 text-center font-semibold text-rose-700">{actionError}</div>}
      {/* Background animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes profile-float-1 {
            0%,100% {
              transform: translateY(0) rotate(12deg) scale(1);
              filter: hue-rotate(0deg);
            }
            50% {
              transform: translateY(-30px) translateX(15px) rotate(20deg) scale(1.05);
              filter: hue-rotate(35deg);
            }
          }

          @keyframes profile-float-2 {
            0%,100% {
              transform: translateY(0) rotate(-12deg);
            }
            50% {
              transform: translateY(25px) translateX(-18px) rotate(-5deg);
            }
          }

          @keyframes modal-in {
            from {
              opacity: 0;
              transform: translateY(20px) scale(.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .profile-float-1 {
            animation: profile-float-1 14s ease-in-out infinite;
          }

          .profile-float-2 {
            animation: profile-float-2 18s ease-in-out infinite;
          }

          .modal-in {
            animation: modal-in .28s ease-out;
          }
        `,
        }}
      />

      {/* Background shapes */}
      <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-[3rem] bg-gradient-to-br from-rose-300/30 to-violet-500/25 profile-float-1" />

      <div className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-[3rem] bg-gradient-to-bl from-violet-500/30 to-fuchsia-300/25 profile-float-2" />

      <div className="pointer-events-none absolute left-[38%] top-[40%] h-64 w-64 rounded-[3rem] bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 profile-float-1" />

      <div className="pointer-events-none absolute -bottom-20 right-[10%] h-80 w-80 rounded-[3rem] bg-gradient-to-br from-amber-300/20 to-orange-300/20 profile-float-2" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-indigo-100/20" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* Back */}
        {/* <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-xl transition hover:-translate-x-1 hover:text-violet-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link> */}

       

        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/85 shadow-[0_30px_80px_rgba(79,55,211,0.12)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400" />

          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            {/* Instructor identity */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#2D1B69] via-[#4E37D3] to-[#9D4EDD] text-3xl font-black text-white shadow-2xl shadow-violet-300/50">
                  {instructor.initials}
                </div>

                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight text-[#172033] sm:text-4xl">
                    {instructor.name}
                  </h1>

                
                </div>

                <p className="text-base font-semibold text-violet-600">
                  {instructor.title}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    {instructor.email}
                  </span>

                  <span className="flex items-center gap-2">
                    <GraduationCap size={15} />
                    {instructor.department}
                  </span>

                 
                </div>
              </div>
            </div>

            {/* Rating */}
            {/* <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-white shadow-lg shadow-amber-200">
                <Star size={22} fill="currentColor" />
              </div>

              <div>
                <p className="text-2xl font-black text-slate-800">
                  {instructor.rating}
                </p>

                <p className="text-xs font-semibold text-slate-400">
                  Instructor Rating
                </p>
              </div>
            </div> */}
          </div>
        </section>


        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="Assigned Courses"
            value={courses.length.toString()}
            iconClass="bg-violet-100 text-violet-600"
          />

          <StatCard
          icon={Users}
            label="Course Enrollments"
            value={totalStudents.toLocaleString()}
            iconClass="bg-cyan-100 text-cyan-600"
          />

          {/* <StatCard
            icon={Clock3}
            label="Course Hours"
            value={`${totalHours}h`}
            iconClass="bg-orange-100 text-orange-600"
          /> */}

       
        </section>

        {/* About */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-xl shadow-violet-100/40 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <UserRound size={19} />
              </div>

              <h2 className="text-xl font-extrabold text-slate-800">
                About Instructor
              </h2>
            </div>

            <p className="max-w-3xl text-sm leading-7 text-slate-500">
              {instructor.bio}
            </p>
          </div>

          {/* <div className="rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-xl shadow-violet-100/40 backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-extrabold text-slate-800">
              Instructor Details
            </h2>

            <div className="space-y-4">
              <Detail
                icon={CalendarDays}
                label="Joined"
                value={instructor.joined}
              />

              <Detail
                icon={TrendingUp}
                label="Experience"
                value={instructor.experience}
              />

              <Detail
                icon={Users}
                label="Students Reached"
                value={instructor.students.toLocaleString()}
              />

              <Detail
                icon={Clock3}
                label="Teaching Hours"
                value={`${instructor.teachingHours} hours`}
              />
            </div>
          </div> */}
        </section>


        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-500">
                Course Management
              </p>

              <h2 className="text-2xl font-black text-[#1A253C] sm:text-3xl">
                Instructor Courses
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage courses assigned to {instructor.name}.
              </p>
            </div>

            <button
              onClick={() => setShowAddCourse(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4E37D3] to-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-300/50 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Plus size={18} />
              Assign Course
            </button>
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {courses.map((course) => (
                <CourseManagementCard
                  key={course.id}
                  course={course}
                  removing={actionLoading === `remove-${course.id}`}
                  onRemove={() => removeCourse(course)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-violet-200 bg-white/70 px-6 py-16 text-center backdrop-blur-xl">
              <BookOpen
                size={35}
                className="mx-auto mb-3 text-violet-300"
              />

              <h3 className="font-bold text-slate-700">
                No courses assigned
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Assign a course to this instructor to get started.
              </p>

              <button
                onClick={() => setShowAddCourse(true)}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white"
              >
                Assign Course
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ===================================== */}
      {/* ADD COURSE MODAL */}
      {/* ===================================== */}

      {showAddCourse && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[7px]"
          onMouseDown={() => setShowAddCourse(false)}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="modal-in relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white bg-white/95 shadow-[0_30px_100px_rgba(40,25,100,0.35)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-300/30 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-2xl font-black text-[#1A253C]">
                  Assign Course
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Add another course to {instructor.name}.
                </p>
              </div>

              <button
                onClick={() => setShowAddCourse(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:rotate-90 hover:bg-violet-50 hover:text-violet-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* Search */}
            <div className="relative px-6 pt-5">
              <Search
                size={18}
                className="absolute left-10 top-[38px] text-slate-400"
              />

              <input
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search available courses..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {actionError && (
              <div className="mx-6 mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {actionError}
              </div>
            )}

            {/* Available Courses */}
            <div className="max-h-[420px] overflow-y-auto p-6">
              {availableLoading ? (
                <div className="py-10 text-center text-sm font-semibold text-violet-600">Loading courses...</div>
              ) : remainingCourses.length > 0 ? (
                <div className="space-y-3">
                  {remainingCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-violet-200 hover:bg-violet-50/40 sm:flex-row sm:items-center"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${course.iconBg}`}
                      >
                        <BookOpen size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-extrabold text-slate-800">
                          {course.title}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {course.category} · {course.level} · {course.hours}h
                        </p>
                      </div>

                      <button
                        disabled={actionLoading === `add-${course.id}`}
                        onClick={() => addCourse(course)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
                      >
                        <Plus size={15} />
                        {actionLoading === `add-${course.id}` ? "Assigning..." : "Assign"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Check
                    size={32}
                    className="mx-auto mb-3 text-emerald-500"
                  />

                  <p className="font-bold text-slate-700">
                    No more courses available
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    All matching courses are already assigned.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ======================================== */
/* COMPONENTS */
/* ======================================== */

function StatCard({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconClass: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-[1.6rem] border border-white/80 bg-white/80 p-5 shadow-lg shadow-violet-100/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconClass}`}
      >
        <Icon size={21} />
      </div>

      <div>
        <p className="text-2xl font-black text-slate-800">
          {value}
        </p>

        <p className="text-xs font-semibold text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <Icon size={15} />
        {label}
      </span>

      <span className="text-sm font-bold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function CourseManagementCard({
  course,
  onRemove,
  removing,
}: {
  course: Course;
  onRemove: () => void;
  removing: boolean;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-violet-100/40 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
      {/* Top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${course.color}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${course.iconBg}`}
          >
            <BookOpen size={21} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-[#1A253C]">
              {course.title}
            </h3>

            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              {course.category}
            </p>
          </div>
        </div>

        <button
          disabled={removing}
          onClick={onRemove}
          title="Remove course"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 opacity-100 transition hover:bg-rose-500 hover:text-white disabled:opacity-40 lg:opacity-0 lg:group-hover:opacity-100"
        >
          <Trash2 size={17} />
        </button>
      </div>

      {/* Course details */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        <CourseMetric
          icon={Users}
          value={course.students.toLocaleString()}
          label="Students"
        />

        <CourseMetric
          icon={Clock3}
          value={`${course.hours}h`}
          label="Hours"
        />

        <CourseMetric
          icon={BookOpen}
          value={course.lessons.toString()}
          label="Modules"
        />
      </div>

      {/* Rating & Level */}
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
          {course.level}
        </span>
{/*  */}
      </div>

    </article>
  );
}

function CourseMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50/80 px-3 py-3 text-center">
      <Icon size={15} className="mx-auto mb-1 text-slate-400" />

      <p className="text-sm font-black text-slate-700">
        {value}
      </p>

      <p className="text-[10px] font-semibold text-slate-400">
        {label}
      </p>
    </div>
  );
}
