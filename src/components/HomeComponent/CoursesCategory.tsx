"use client";

import Link from "next/link";
// تغيير Planet إلى Globe و Orbit لضمان التوافق
import { 
  Monitor, 
  Briefcase, 
  Palette, 
  User, 
  Camera, 
  HeartPulse, 
  Lightbulb,
  Globe, 
  Orbit ,
  Circle
} from "lucide-react";

// إذا كنت تستخدم TypeScript وتواجه مشكلة في LucideIcon، استوردها كـ type
import type { LucideIcon } from "lucide-react";

interface CategoryDisplay {
  name: string;
  count: string;
  icon: LucideIcon;
  color: string;
}



const DEFAULT_CATEGORIES: CategoryDisplay[] = [
  { name: "Technology", count: "25,450+ Courses", icon: Monitor, color: "bg-blue-500" },
  { name: "Business", count: "575+ Courses", icon: Briefcase, color: "bg-emerald-500" },
  { name: "Design & Art", count: "256+ Courses", icon: Palette, color: "bg-pink-500" },
  { name: "Personal Development", count: "175+ Courses", icon: User, color: "bg-orange-500" },
  { name: "Photography & Video", count: "855+ Courses", icon: Camera, color: "bg-purple-500" },
  { name: "Health & Wellness", count: "225+ Courses", icon: HeartPulse, color: "bg-red-500" },
];

export default function CoursesCategory() {
  const categories = DEFAULT_CATEGORIES;

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fafafa] py-24 px-6">
      
      {/* --- خلفية الـ Mesh Gradient المميزة --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* بقعة ضوء أرجوانية كبيرة */}
        <div className="absolute -top-[10%] -left-[10%] h-[70%] w-[70%] rounded-full bg-purple-200/40 blur-[140px]" />
        {/* بقعة ضوء زرقاء في الوسط */}
        <div className="absolute top-[20%] right-[5%] h-[60%] w-[50%] rounded-full bg-blue-100/50 blur-[120px]" />
        {/* بقعة ضوء وردية في الأسفل */}
        <div className="absolute -bottom-[10%] left-[20%] h-[50%] w-[60%] rounded-full bg-pink-100/30 blur-[130px]" />
      </div>

      {/* --- اللمبة (تصميم عائم ومميز) --- */}
      <div className="absolute left-[8%] top-[12%] z-10 hidden lg:block animate-bounce [animation-duration:4s]">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-white/40 shadow-2xl backdrop-blur-md border border-white/50 rotate-[-15deg]">
          <Lightbulb className="h-16 w-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        </div>
      </div>

      {/* --- الكوكب (ضخم ومائل جداً مع حلقات) --- */}
      <div className="absolute -right-10 bottom-[5%] z-10 hidden lg:block">
        <div className="relative rotate-[40deg] scale-[2.2] opacity-80">
          <div className="absolute inset-0 rounded-full border-[1px] border-purple-300/30 scale-[1.4] rotate-x-45" />
          <Globe className="h-10 w-50 text-purple-400" />
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-6xl text-center ">
        <div className="inline-block px-2 py-1.5 mb-6 rounded-full bg-purple-100 text-purple-700   tracking-wide uppercase">
            Top Categories
        </div>
        <Circle className="h-10 w-90 text-purple-400" />
      <h2 className="mb-16 text-5xl font-black tracking-tight  ">
          Explore Our <span className="text-purple-600">Course</span>
        </h2>

        {/* Grid Categories */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/courses?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex items-center rounded-[2.5rem] border border-white bg-white/60 p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-200/60"
            >
              {/* أيقونة ملونة ومميزة */}
              <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.8rem] ${cat.color} text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg]`}>
                <cat.icon size={36} strokeWidth={1.8} />
              </div>
              

              {/* نصوص الكارت */}
              <div className="ml-8 text-left">
                <h3 className="text-2xl font-extrabold text-slate-800 transition-colors group-hover:text-purple-600">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {cat.count}
                </p>
              </div>
              
              
              {/* سهم صغير يظهر عند الهوفر */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-2 text-purple-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              
            </Link>
          ))}
        </div>

        {/* زر See All بتأثير لامع */}
        <div className="mt-24">
          <Link
            href="/courses"
            className="group relative inline-flex items-center overflow-hidden rounded-2xl bg-slate-900 px-16 py-5 text-xl font-black text-white transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">See All Categories</span>
            <div className="absolute inset-0 z-0  opacity-0 transition-opacity  text-blue-400 duration-500 group-hover:opacity-100" />
          </Link>
        </div>
      </div>
       <Orbit className="h-20 w-90 text-blue-400" />
    </section>
  );
}