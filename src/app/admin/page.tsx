'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  GraduationCap,
  Trash2,
  ArrowLeft,
  User,
  CheckCircle2,
  School,
  X,
  Search,
  UserCheck,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

type DashboardStats = {
  total_users: number;
  courses: number;
  instructors: number;
  students: number;
  categories: number;
  total_enrollments: number;
  active_enrollments: number;
};

type FullStudent = {
  id: number;
  userId: number;
  name: string;
  email: string;
  initials: string;
  color: string;
  country: string;
  status: 'Active' | 'Inactive';
};

type InstructorItem = {
  id: number;
  userId: number;
  name: string;
  email: string;
  status: string;
  initials: string;
  color: string;
  time: string;
};

export default function AdminDashboardPage() {
  const [showInstructors, setShowInstructors] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<InstructorItem | null>(null);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_users: 0,
    courses: 0,
    instructors: 0,
    students: 0,
    categories: 0,
    total_enrollments: 0,
    active_enrollments: 0,
  });

  const [allStudents, setAllStudents] = useState<FullStudent[]>([]);
  const [teachers, setTeachers] = useState<InstructorItem[]>([]);
  const [allInstructorsFull, setAllInstructorsFull] = useState<InstructorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [instructorPage, setInstructorPage] = useState(1);
  const [instructorLastPage, setInstructorLastPage] = useState(1);

  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "" });

  const getHeaders = (withJson = false): Record<string, string> => {
    const token = localStorage.getItem("token") ?? localStorage.getItem("access_token");
    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (withJson) headers["Content-Type"] = "application/json";

    return headers;
  };

  const readError = async (response: Response) => {
    const payload = await response.json().catch(() => null);
    return payload?.message ?? `Request failed (${response.status})`;
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      const token = localStorage.getItem("token") ?? localStorage.getItem("access_token");
      if (!token) {
        setApiError("Your session has expired. Please sign in again.");
        setLoading(false);
        return;
      }

      const headers = { Accept: "application/json", Authorization: `Bearer ${token}` };

      try {
        setLoading(true);
        setApiError("");
        const [statsResponse, instructorResponse, firstStudentResponse] = await Promise.all([
          fetch(`${API_URL}/admin/dashboard`, { headers, signal: controller.signal }),
          fetch(`${API_URL}/instructor-profiles`, { headers, signal: controller.signal }),
          fetch(`${API_URL}/student-profiles?page=1`, { headers, signal: controller.signal }),
        ]);

        if (!statsResponse.ok || !instructorResponse.ok || !firstStudentResponse.ok) {
          throw new Error(
            `Unable to load dashboard (${statsResponse.status}/${instructorResponse.status}/${firstStudentResponse.status})`
          );
        }

        const statsPayload = await statsResponse.json();
        const instructorPayload = await instructorResponse.json();
        const firstStudentPayload = await firstStudentResponse.json();
        const lastPage = firstStudentPayload.meta?.last_page ?? 1;
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) =>
            fetch(`${API_URL}/student-profiles?page=${index + 2}`, { headers, signal: controller.signal }).then((response) => {
              if (!response.ok) throw new Error(`Unable to load students (${response.status})`);
              return response.json();
            })
          )
        );

        const instructorItems: InstructorItem[] = instructorPayload.data.map((profile: any) => {
          const name = profile.user?.name ?? "Instructor";
          return {
            id: profile.id,
            userId: profile.user?.id,
            name,
            email: profile.user?.email ?? "—",
            status: "Instructor",
            initials: name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase(),
            color: "bg-violet-100 text-violet-800 border-violet-200",
            time: `${profile.years_experience ?? 0} years experience`,
          };
        });

        const studentProfiles = [firstStudentPayload, ...remainingPages].flatMap((page) => page.data ?? []);
        const studentItems: FullStudent[] = studentProfiles.map((profile: any) => {
          const name = profile.user?.name ?? "Student";
          return {
            id: profile.id,
            userId: profile.user?.id,
            name,
            email: profile.user?.email ?? "—",
            initials: name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase(),
            color: "bg-blue-100 text-blue-800 border-blue-200",
            country: profile.country ?? "Unspecified",
            status: profile.user?.is_active ? "Active" as const : "Inactive" as const,
          };
        });

        setDashboardStats(statsPayload.data);
        setTeachers(instructorItems.slice(0, 5));
        setAllInstructorsFull(instructorItems);
        setInstructorPage(instructorPayload.meta?.current_page ?? 1);
        setInstructorLastPage(instructorPayload.meta?.last_page ?? 1);
        setAllStudents(studentItems);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") setApiError((requestError as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
    return () => controller.abort();
  }, []);

  const promoteToInstructor = async (student: FullStudent) => {
    try {
      setActionLoading(`promote-${student.userId}`);
      setApiError("");

      const response = await fetch(`${API_URL}/users/${student.userId}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify({ role: "instructor" }),
      });

      if (!response.ok) throw new Error(await readError(response));

      const payload = await response.json();
      const user = payload.data ?? payload;
      const instructor: InstructorItem = {
        id: user.instructor_profile?.id ?? student.userId,
        userId: student.userId,
        name: student.name,
        email: student.email,
        status: "Instructor",
        initials: student.initials,
        color: "bg-violet-100 text-violet-800 border-violet-200",
        time: "Just now",
      };

      setAllStudents(prev => prev.filter(item => item.userId !== student.userId));
      setTeachers(prev => [instructor, ...prev].slice(0, 5));
      setAllInstructorsFull(prev => [instructor, ...prev]);
      setDashboardStats(prev => ({
        ...prev,
        students: Math.max(0, prev.students - 1),
        instructors: prev.instructors + 1,
      }));
    } catch (error) {
      setApiError((error as Error).message);
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteInstructor = async (instructor: InstructorItem) => {
    try {
      setActionLoading(`delete-${instructor.userId}`);
      setApiError("");

      const response = await fetch(`${API_URL}/users/${instructor.userId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(await readError(response));

      setTeachers(prev => prev.filter(item => item.userId !== instructor.userId));
      setAllInstructorsFull(prev => prev.filter(item => item.userId !== instructor.userId));
      setDashboardStats(prev => ({
        ...prev,
        total_users: Math.max(0, prev.total_users - 1),
        instructors: Math.max(0, prev.instructors - 1),
      }));
      setConfirmDelete(null);
    } catch (error) {
      setApiError((error as Error).message);
    } finally {
      setActionLoading("");
    }
  };

  const loadInstructorPage = async (page: number) => {
    try {
      setActionLoading("instructor-page");
      setApiError("");
      const response = await fetch(`${API_URL}/instructor-profiles?page=${page}`, {
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(await readError(response));

      const payload = await response.json();
      const items: InstructorItem[] = (payload.data ?? []).map((profile: any) => {
        const name = profile.user?.name ?? "Instructor";
        return {
          id: profile.id,
          userId: profile.user?.id,
          name,
          email: profile.user?.email ?? "—",
          status: "Instructor",
          initials: name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase(),
          color: "bg-violet-100 text-violet-800 border-violet-200",
          time: `${profile.years_experience ?? 0} years experience`,
        };
      });

      setAllInstructorsFull(items);
      setInstructorPage(payload.meta?.current_page ?? page);
      setInstructorLastPage(payload.meta?.last_page ?? 1);
    } catch (error) {
      setApiError((error as Error).message);
    } finally {
      setActionLoading("");
    }
  };

  const filteredStudents = useMemo(() => {
    return allStudents.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchCountry = filterCountry === "All" || s.country === filterCountry;
      const matchStatus = filterStatus === "All" || s.status === filterStatus;
      return matchSearch && matchCountry && matchStatus;
    });
  }, [allStudents, search, filterCountry, filterStatus]);

  const countries = useMemo(
    () => Array.from(new Set(allStudents.map(student => student.country))).sort(),
    [allStudents]
  );

  const latestStudents = allStudents.slice(0, 5);

  useEffect(() => {
    if (showInstructors || showStudents || showAddStudent || confirmDelete) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    const onEsc = (e: KeyboardEvent) => { if(e.key === 'Escape'){ setShowInstructors(false); setShowStudents(false); setShowAddStudent(false); setConfirmDelete(null);} }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [showInstructors, showStudents, showAddStudent, confirmDelete]);

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || newStudent.password.length < 8) return;

    try {
      setActionLoading("add-student");
      setApiError("");
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          name: newStudent.name,
          email: newStudent.email,
          password: newStudent.password,
          role: "student",
          is_active: true,
        }),
      });

      if (!response.ok) throw new Error(await readError(response));

      const payload = await response.json();
      const user = payload.data ?? payload;
      const name = user.name;
      const student: FullStudent = {
        id: user.student_profile?.id ?? user.id,
        userId: user.id,
        name,
        email: user.email,
        initials: name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase(),
        color: "bg-blue-100 text-blue-800 border-blue-200",
        country: user.student_profile?.country ?? "Unspecified",
        status: user.is_active ? "Active" : "Inactive",
      };

      setAllStudents(prev => [student, ...prev]);
      setDashboardStats(prev => ({
        ...prev,
        total_users: prev.total_users + 1,
        students: prev.students + 1,
      }));
      setNewStudent({ name: "", email: "", password: "" });
      setShowAddStudent(false);
    } catch (error) {
      setApiError((error as Error).message);
    } finally {
      setActionLoading("");
    }
  };

  const stats = [
    { title: "Total Users", value: dashboardStats.total_users.toLocaleString(), icon: Users, color: "bg-violet-500" },
    { title: "Courses", value: dashboardStats.courses.toLocaleString(), icon: BookOpen, color: "bg-teal-400" },
    { title: "Instructors", value: dashboardStats.instructors.toLocaleString(), icon: UserCheck, color: "bg-blue-400" },
    { title: "Students", value: dashboardStats.students.toLocaleString(), icon: GraduationCap, color: "bg-fuchsia-400" },
  ];

  const infoCards = [
    { title: "Categories", value: dashboardStats.categories.toLocaleString(), desc: "Available learning categories", icon: CheckCircle2, color: "bg-rose-400" },
    { title: "Total Enrollments", value: dashboardStats.total_enrollments.toLocaleString(), desc: "All course registrations", icon: User, color: "bg-amber-400" },
    { title: "Active Enrollments", value: dashboardStats.active_enrollments.toLocaleString(), desc: "Currently studying", icon: School, color: "bg-emerald-400" },
  ];

  return (
    <div dir="ltr" className="min-h-screen bg-[#F4F7FB] relative overflow-hidden font-sans text-slate-800">
      {loading && <div className="fixed inset-0 z-[200] grid place-items-center bg-white/70 text-violet-700 font-bold backdrop-blur-sm">Loading dashboard...</div>}
      {apiError && <div className="relative z-[201] mx-auto mt-4 max-w-3xl rounded-2xl bg-rose-50 px-5 py-4 text-center font-semibold text-rose-700">{apiError}</div>}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-1 { 0%,100%{transform:translateY(0) rotate(12deg) scale(1);filter:hue-rotate(0deg)} 50%{transform:translateY(-30px) translateX(15px) rotate(20deg) scale(1.05);filter:hue-rotate(45deg)} }
        @keyframes float-2 { 0%,100%{transform:translateY(0) rotate(-12deg) scale(1);filter:hue-rotate(0deg)} 50%{transform:translateY(25px) translateX(-20px) rotate(-6deg) scale(0.95);filter:hue-rotate(-45deg)} }
        @keyframes float-3 { 0%,100%{transform:translate(0,0) rotate(45deg);filter:hue-rotate(0deg)} 50%{transform:translate(-20px,15px) rotate(60deg);filter:hue-rotate(30deg)} }
        .anim-f-1{animation:float-1 14s ease-in-out infinite}
        .anim-f-2{animation:float-2 16s ease-in-out infinite}
        .anim-f-3{animation:float-3 18s ease-in-out infinite}
      `}} />

      <div className="absolute top-6 -left-12 w-72 h-72 bg-gradient-to-br from-[#E37D73]/35 to-[#4E37D3]/25 rounded-[2.5rem] pointer-events-none shadow-md anim-f-1" />
      <div className="absolute top-14 -right-10 w-64 h-64 bg-gradient-to-bl from-[#4E37D3]/40 to-[#8B5CF6]/30 rounded-[2.2rem] pointer-events-none shadow-lg anim-f-2" />
      <div className="absolute top-48 left-[25%] w-40 h-40 bg-gradient-to-tr from-[#06B6D4]/35 to-[#10B981]/20 rounded-[1.8rem] pointer-events-none blur-[0.5px] anim-f-3" />
      <div className="absolute top-[22%] -left-8 w-56 h-56 bg-gradient-to-r from-[#F59E0B]/30 to-[#E37D73]/25 rounded-[2rem] pointer-events-none anim-f-2" />
      <div className="absolute top-[32%] -right-5 w-60 h-60 bg-gradient-to-l from-[#EC4899]/30 to-[#8B5CF6]/25 rounded-[2.5rem] pointer-events-none anim-f-1" />
      <div className="absolute top-[42%] left-[8%] w-48 h-48 bg-gradient-to-tr from-[#3B82F6]/35 to-[#06B6D4]/20 rounded-[1.8rem] pointer-events-none anim-f-3" />
      <div className="absolute top-[55%] right-[15%] w-44 h-44 bg-gradient-to-br from-[#10B981]/25 to-[#EAB308]/15 rounded-[1.5rem] pointer-events-none anim-f-2" />
      <div className="absolute bottom-[28%] -left-10 w-64 h-64 bg-gradient-to-tr from-[#8B5CF6]/35 to-[#2563EB]/20 rounded-[2.5rem] pointer-events-none anim-f-1" />
      <div className="absolute bottom-[16%] -right-8 w-56 h-56 bg-gradient-to-bl from-[#EAB308]/30 to-[#F59E0B]/20 rounded-[2rem] pointer-events-none anim-f-3" />
      <div className="absolute bottom-6 left-[35%] w-80 h-48 bg-gradient-to-r from-[#2563EB]/35 to-[#4E37D3]/25 rounded-[2.2rem] pointer-events-none blur-[1px] anim-f-1" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAEFF7]/10 via-transparent to-[#E3E9F8]/20 pointer-events-none z-0" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Overview</h1>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 px-6 py-7 shadow-2xl shadow-violet-100/50 backdrop-blur-xl transition duration-500 hover:-translate-y-1">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${s.color}`}><Icon size={22} /></div>
                <p className="text-sm font-medium text-slate-400">{s.title}</p>
                <h3 className="mt-1 text-3xl font-extrabold text-slate-800">{s.value}</h3>
              </div>
            );
          })}
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          {infoCards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="flex items-center gap-5 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl transition duration-500 hover:-translate-y-1">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${c.color}`}><Icon size={26} /></div>
                <div><h4 className="text-xl font-extrabold text-slate-800">{c.value}</h4><p className="text-sm font-semibold text-slate-500">{c.title}</p><p className="text-xs text-slate-400">{c.desc}</p></div>
              </div>
            );
          })}
        </section>

        {/* <section className="rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 px-8 py-6 shadow-2xl shadow-violet-200/50">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div><h2 className="text-2xl font-extrabold text-white tracking-tight">Course Management</h2><p className="text-violet-100">Create, edit, and organize your learning content.</p></div>
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg hover:bg-violet-50"><Plus size={18} /> Add Course</button>
              <button className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"><Trash2 size={18} /> Delete Course</button>
            </div>
          </div>
        </section> */}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-violet-100/50 px-6 py-5">
              <h3 className="text-lg font-extrabold">Latest Students</h3>
              <button onClick={() => setShowStudents(true)} className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 hover:underline">View All <ArrowLeft size={16} /></button>
            </div>
            <div className="divide-y divide-violet-50">
              {latestStudents.map((s) => (
                <div key={s.email} className="flex items-center gap-2 px-6 py-4 hover:bg-violet-50/40">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold shadow-md border ${s.color}`}>{s.initials}</div>
                  <div className="min-w-0 flex-1"><div className="font-bold truncate">{s.name}</div><div className="text-xs text-slate-400 truncate">{s.email}</div></div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">Student</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={()=>setShowAddStudent(true)} className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-700">+</button>
                    <button disabled={actionLoading === `promote-${s.userId}`} onClick={()=>promoteToInstructor(s)} title="Promote to Instructor" className="rounded-xl bg-[#2E1A6B] px-2.5 py-2 text-white hover:bg-[#241555] transition shadow disabled:opacity-50">
                      <UserCheck size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {latestStudents.length===0 && <div className="p-8 text-center text-sm text-slate-400">No students left</div>}
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-violet-100/50 px-6 py-5">
              <h3 className="text-lg font-extrabold">Latest Instructors</h3>
              <button onClick={() => setShowInstructors(true)} className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 hover:underline">View All <ArrowLeft size={16} /></button>
            </div>
            <div className="divide-y divide-violet-50">
              {teachers.map((t) => (
              <div key={t.email} className="flex items-center gap-4 px-6 py-4 hover:bg-violet-50/40">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold ${t.color}`}>{t.initials}</div>
                <div className="flex-1 min-w-0"><div className="font-bold truncate">{t.name}</div><div className="text-xs text-slate-400">{t.email}</div></div>
                <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">{t.status}</span>
                <button onClick={()=>setConfirmDelete(t)} className="rounded-xl bg-rose-500 px-2 py-2 text-white hover:bg-rose-600"><Trash2 size={16} /></button>
              </div>
            ))}
            {teachers.length===0 && <div className="p-8 text-center text-sm text-slate-400">No instructors</div>}
            </div>
          </div>
        </section>
      </main>

      {showInstructors && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[6px]" onClick={() => setShowInstructors(false)} />
          <div className="relative w-full max-w-[850px] max-h-[85vh] bg-white/95 backdrop-blur-2xl rounded-[1.8rem] shadow-2xl border border-white flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b"><h2 className="text-[22px] font-extrabold text-[#2D1B4D]">All Instructors</h2><button onClick={() => setShowInstructors(false)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={20}/></button></div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
              {allInstructorsFull.map((t,i) => (
                <div key={i} className="group flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3.5 hover:bg-[#F8F7FF] transition">
                  <span className="text-[12px] text-slate-600 font-medium whitespace-nowrap hidden md:block w-[85px]">{t.time}</span>
                  <span className="bg-[#EAF2FF] text-[#4A6FA5] text-[11px] font-bold px-2.5 py-1 rounded-full">Instructor</span>
                  <button onClick={()=>setConfirmDelete(t)} className="w-9 h-9 flex items-center justify-center rounded-xl text-[#8B3A4A] hover:bg-rose-50 transition"><Trash2 size={18} /></button>
                  <div className="flex-1 min-w-0 text-left"><div className="font-bold text-[14px] text-slate-800 truncate">{t.name}</div><div className="text-[12px] text-slate-400 truncate -mt-0.5">{t.email}</div></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-extrabold border-2 shadow-sm shrink-0 ${t.color}`}>{t.initials}</div>
                  <Link href={`/admin/profile/${t.id}?role=instructor`} className="bg-[#2E1A6B] hover:bg-[#241555] text-white text-[12px] font-bold px-3 sm:px-5 py-2.5 rounded-xl shadow-lg transition whitespace-nowrap">Go to Profile</Link>
                </div>
              ))}
              {allInstructorsFull.length===0 && <div className="p-10 text-center text-slate-400">No instructors</div>}
            </div>
            <div className="flex items-center justify-between border-t px-8 py-4">
              <span className="text-sm font-semibold text-slate-500">Page {instructorPage} of {instructorLastPage}</span>
              <div className="flex gap-2">
                <button disabled={instructorPage <= 1 || actionLoading === "instructor-page"} onClick={() => loadInstructorPage(instructorPage - 1)} className="rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-40">Previous</button>
                <button disabled={instructorPage >= instructorLastPage || actionLoading === "instructor-page"} onClick={() => loadInstructorPage(instructorPage + 1)} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStudents && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-[8px]" onClick={()=>setShowStudents(false)} />
          <div className="relative w-full max-w-[1000px] max-h-[92vh] bg-[#F6F3FA]/90 backdrop-blur-2xl rounded-[1.8rem] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.5)] border border-white flex flex-col overflow-hidden">
            <div className="px-6 sm:px-8 py-5">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-[#2D2B3A] flex items-center justify-center text-white"><span className="text-lg">🌙</span></div>
                <h2 className="text-3xl font-extrabold text-[#5B3E8A] tracking-tight">All Students</h2>
                <button onClick={()=>setShowStudents(false)} className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-50"><X size={18}/></button>
              </div>
              <div className="flex gap-3 mt-6">
                <div className="flex-1 relative">
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student by name or email..." className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" style={{direction:'ltr'}} />
                </div>
                <button className="bg-[#6B5B8C] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow"><Search size={18}/> Search</button>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <select value={filterCountry} onChange={e=>setFilterCountry(e.target.value)} className="rounded-xl bg-[#E9E5EE] px-4 py-2 text-sm font-bold text-slate-700 border-0">
                  <option value="All">Filter by Country: [All]</option>
                  {countries.map(country => <option key={country} value={country}>{country}</option>)}
                </select>
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="rounded-xl bg-[#E9E5EE] px-4 py-2 text-sm font-bold text-slate-700 border-0">
                  <option value="All">Filter by Status: [All]</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mx-3 sm:mx-6 bg-[#6B4F8A] text-white rounded-t-2xl grid grid-cols-12 text-sm font-bold py-3 px-4">
              <div className="col-span-3 text-center">Promote</div>
              <div className="col-span-4 text-center">Email</div>
              <div className="col-span-2 text-center">Student Name</div>
              <div className="col-span-1 text-center">Avatar</div>
              <div className="col-span-2 text-center">Action</div>
            </div>
            <div className="flex-1 overflow-y-auto mx-3 sm:mx-6 bg-white rounded-b-2xl divide-y divide-[#EEEAF4] mb-4 shadow-inner">
              {filteredStudents.map((s,i)=>(
                <div key={i} className="grid grid-cols-12 items-center py-3 px-2 sm:px-4 text-[13px] hover:bg-[#FAF8FF]">
                  <div className="col-span-3 flex justify-center">
                    <button disabled={actionLoading === `promote-${s.userId}`} onClick={()=>promoteToInstructor(s)} className="bg-[#2E1A6B] text-white text-[11px] font-bold px-3 py-2 rounded-full flex items-center gap-1 hover:bg-[#241555] disabled:opacity-50"><UserCheck size={12}/> Make Instructor</button>
                  </div>
                  <div className="col-span-4 text-center truncate font-medium text-slate-700">{s.email}</div>
                  <div className="col-span-2 text-center font-bold text-slate-800 truncate">{s.name}</div>
                  <div className="col-span-1 flex justify-center"><div className={`w-9 h-9 rounded-full border-2 shadow-sm flex items-center justify-center text-[11px] font-extrabold ${s.color}`}>{s.initials}</div></div>
                  <Link href={`/admin/profile/${s.id}?role=student`} className="bg-[#5B3E8A] text-white text-[11px] font-bold px-3 py-2 rounded-full whitespace-nowrap hover:bg-[#4a3070] transition">
                    Go to Profile
                  </Link>
                </div>
              ))}
              {filteredStudents.length===0 && <div className="py-10 text-center text-slate-400">No students found</div>}
            </div>
            <div className="px-8 pb-4 text-left text-sm font-bold text-slate-700">Total Students: {allStudents.length}</div>
          </div>
        </div>
      )}

      {showAddStudent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[6px]" onClick={()=>setShowAddStudent(false)} />
          <div className="relative w-full max-w-[500px] bg-white/95 backdrop-blur-2xl rounded-[1.8rem] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.4)] border border-white p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#2D1B4D]">Add New Student</h3>
              <button onClick={()=>setShowAddStudent(false)} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-bold text-slate-600">Full Name</label><input value={newStudent.name} onChange={e=>setNewStudent({...newStudent,name:e.target.value})} placeholder="e.g. Fatima Alzahra" className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F9FAFF] px-4 py-3 text-sm focus:ring-2 focus:ring-violet-400 outline-none"/></div>
              <div><label className="text-sm font-bold text-slate-600">Email</label><input value={newStudent.email} onChange={e=>setNewStudent({...newStudent,email:e.target.value})} placeholder="e.g. fatima@example.com" className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F9FAFF] px-4 py-3 text-sm focus:ring-2 focus:ring-violet-400 outline-none"/></div>
              <div><label className="text-sm font-bold text-slate-600">Password</label><input type="password" minLength={8} value={newStudent.password} onChange={e=>setNewStudent({...newStudent,password:e.target.value})} placeholder="At least 8 characters" className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F9FAFF] px-4 py-3 text-sm focus:ring-2 focus:ring-violet-400 outline-none"/></div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={()=>setShowAddStudent(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Cancel</button>
              <button disabled={actionLoading === "add-student" || !newStudent.name || !newStudent.email || newStudent.password.length < 8} onClick={handleAddStudent} className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 text-sm font-bold shadow-lg hover:scale-[1.02] transition disabled:opacity-50">{actionLoading === "add-student" ? "Adding..." : "Add Student +"}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[6px]" onClick={()=>setConfirmDelete(null)} />
          <div className="relative w-full max-w-[380px] bg-white rounded-[1.5rem] p-7 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4"><Trash2/></div>
            <h3 className="font-extrabold text-lg">Delete this instructor?</h3>
            <p className="text-sm text-slate-500 mt-1 break-all">{confirmDelete.email}</p>
            <p className="text-xs text-slate-400 mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6"><button onClick={()=>setConfirmDelete(null)} className="flex-1 rounded-xl border py-2.5 text-sm font-bold">Cancel</button><button disabled={actionLoading === `delete-${confirmDelete.userId}`} onClick={()=>handleDeleteInstructor(confirmDelete)} className="flex-1 rounded-xl bg-rose-600 text-white py-2.5 text-sm font-bold disabled:opacity-50">{actionLoading === `delete-${confirmDelete.userId}` ? "Deleting..." : "Delete"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
