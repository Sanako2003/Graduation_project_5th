"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Monitor,
  Briefcase,
  Palette,
  User,
  Camera,
  HeartPulse,
  Lightbulb,
  Globe,
  Circle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryDisplay {
  id?: number;
  name: string;
  count: string;
  icon: LucideIcon;
  color: string;
}

const DEFAULT_CATEGORIES: CategoryDisplay[] = [
  {
    name: "Technology",
    count: "25,450+ Courses",
    icon: Monitor,
    color: "bg-blue-500",
  },
  {
    name: "Business",
    count: "575+ Courses",
    icon: Briefcase,
    color: "bg-emerald-500",
  },
  {
    name: "Design & Art",
    count: "256+ Courses",
    icon: Palette,
    color: "bg-pink-500",
  },
  {
    name: "Personal Development",
    count: "175+ Courses",
    icon: User,
    color: "bg-orange-500",
  },
  {
    name: "Photography & Video",
    count: "855+ Courses",
    icon: Camera,
    color: "bg-purple-500",
  },
  {
    name: "Health & Wellness",
    count: "225+ Courses",
    icon: HeartPulse,
    color: "bg-red-500",
  },
];

function formatCount(value: number | string | undefined): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0 Courses";
  }

  return `${numericValue.toLocaleString()} Courses`;
}

function getCategoryStyle(name: string): { icon: LucideIcon; color: string } {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("business") || lowerName.includes("marketing")) {
    return { icon: Briefcase, color: "bg-emerald-500" };
  }

  if (
    lowerName.includes("design") ||
    lowerName.includes("art") ||
    lowerName.includes("creative")
  ) {
    return { icon: Palette, color: "bg-pink-500" };
  }

  if (
    lowerName.includes("personal") ||
    lowerName.includes("development") ||
    lowerName.includes("soft")
  ) {
    return { icon: User, color: "bg-orange-500" };
  }

  if (
    lowerName.includes("photo") ||
    lowerName.includes("video") ||
    lowerName.includes("media")
  ) {
    return { icon: Camera, color: "bg-purple-500" };
  }

  if (
    lowerName.includes("health") ||
    lowerName.includes("wellness") ||
    lowerName.includes("medical")
  ) {
    return { icon: HeartPulse, color: "bg-red-500" };
  }

  return { icon: Monitor, color: "bg-blue-500" };
}

export default function CoursesCategory() {
  const [categories, setCategories] =
    useState<CategoryDisplay[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/domains", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch domains");
        }

        const result = await response.json();
        const domains = Array.isArray(result) ? result : result.data || [];

        if (!Array.isArray(domains)) {
          throw new Error("Invalid domains response");
        }

        const mappedCategories = domains.slice(0, 6).map((item: any) => {
          const name = item.name || item.title || item.domain || "Untitled";
          const style = getCategoryStyle(name);

          return {
            id: item.id,
            name,
            count: formatCount(
              item.course_count ??
                item.courses_count ??
                item.count ??
                item.total_courses,
            ),
            icon: style.icon,
            color: style.color,
          } as CategoryDisplay;
        });

        if (active) {
          setCategories(
            mappedCategories.length > 0 ? mappedCategories : DEFAULT_CATEGORIES,
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        if (active) {
          setCategories(DEFAULT_CATEGORIES);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fafafa] py-24 px-6">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[70%] w-[70%] rounded-full bg-purple-200/40 blur-[140px]" />
        <div className="absolute top-[20%] right-[5%] h-[60%] w-[50%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[50%] w-[60%] rounded-full bg-pink-100/30 blur-[130px]" />
      </div>

      <div className="absolute left-[8%] top-[12%] z-10 hidden lg:block animate-bounce [animation-duration:4s]">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-white/40 shadow-2xl backdrop-blur-md border border-white/50 rotate-[-15deg]">
          <Lightbulb className="h-16 w-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        </div>
      </div>

      <div className="absolute -right-10 bottom-[5%] z-10 hidden lg:block">
        <div className="relative rotate-[40deg] scale-[2.2] opacity-80">
          <div className="absolute inset-0 rounded-full border-[1px] border-purple-300/30 scale-[1.4] rotate-x-45" />
          <Globe className="h-10 w-10 text-purple-400" />
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-6xl text-center ">
        <div className="inline-block px-2 py-1.5 mb-6 rounded-full bg-purple-100 text-purple-700 tracking-wide uppercase">
          Top Categories
        </div>
        <Circle className="mx-auto h-10 w-10 text-purple-400 mb-4" />
        <h2 className="mb-16 text-5xl font-black tracking-tight">
          Explore Our <span className="text-purple-600">Course</span>
        </h2>

        {loading && (
          <p className="mb-8 text-sm font-medium text-slate-500">
            Loading categories...
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={
                cat.id
                  ? `/courses?domain_id=${cat.id}`
                  : `/courses?category=${encodeURIComponent(cat.name)}`
              }
              className="group relative flex items-center rounded-[2.5rem] border border-white bg-white/60 p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-200/60"
            >
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.8rem] ${cat.color} text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg]`}
              >
                <cat.icon size={36} strokeWidth={1.8} />
              </div>

              <div className="ml-8 text-left">
                <h3 className="text-2xl font-extrabold text-slate-800 transition-colors group-hover:text-purple-600">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {cat.count}
                </p>
              </div>

              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-2 text-purple-600">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24">
          <Link
            href="/courses"
            className="group relative inline-flex items-center overflow-hidden rounded-2xl bg-slate-900 px-16 py-5 text-xl font-black text-white transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">See All Categories</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
