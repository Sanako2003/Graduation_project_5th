"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourseCard from "@/components/CourseComponent/CourseCard";
import { apiFetch } from "@/lib/api";

interface Course {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

interface DomainOption {
  id: number;
  name: string;
}

export default function CoursesPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const domainIdFromUrl = searchParams.get("domain_id") || "";
  const categoryFromUrl = searchParams.get("category") || "";
  const pageFromUrl = Number(searchParams.get("page") || "1");

  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(pageFromUrl);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDomainId, setActiveDomainId] = useState<string>(domainIdFromUrl);

  useEffect(() => {
    async function loadDomains() {
      try {
        const result = await apiFetch<{ data: DomainOption[] }>("/domains");
        setDomains(result.data);
      } catch (error) {
        console.error("Failed to load domains:", error);
      }
    }

    loadDomains();
  }, []);

  const loadCourses = useCallback(
    async (targetPage: number, domainId: string, categoryName: string) => {
      setLoading(true);
      try {
        const perPage = 12;
        const params = new URLSearchParams({
          page: String(targetPage),
          per_page: String(perPage),
          sort: "trending",
        });
        if (domainId) {
          params.set("domain_id", domainId);
        } else if (categoryName) {
          params.set("category", categoryName);
        }

        const data = await apiFetch<any>(`/courses?${params.toString()}`);

        const mapped: Course[] = (data.data || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          category: c.domain?.name ?? "General",
          price: Number(c.price) || 0,
          rating: Number(c.average_rating) || 0,
          image: c.thumbnail || "https://placehold.co/600x400?text=Course",
        }));

        setCourses(mapped);
        setPage(data.current_page || targetPage);
        setHasMore(Array.isArray(data.data) && data.data.length === perPage);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const findDomainIdByCategory = (categoryName: string) => {
    if (!categoryName) return "";
    const normalized = categoryName.trim().toLowerCase();
    const match = domains.find(
      (domain) => domain.name.trim().toLowerCase() === normalized,
    );
    return match ? String(match.id) : "";
  };

  useEffect(() => {
    const targetDomainId = domainIdFromUrl || findDomainIdByCategory(categoryFromUrl);
    setActiveDomainId(targetDomainId);
    setPage(pageFromUrl);
    loadCourses(pageFromUrl, targetDomainId, categoryFromUrl);
  }, [categoryFromUrl, domainIdFromUrl, domains, pageFromUrl, loadCourses]);

  const handleDomainClick = (domainId: string) => {
    const params = new URLSearchParams();
    if (domainId) params.set("domain_id", domainId);
    params.set("page", "1");
    router.push(`/courses?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (activeDomainId) params.set("domain_id", activeDomainId);
    params.set("page", String(newPage));
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <section className="px-10 py-20">
      <p className="mb-2 text-sm font-semibold text-purple-700">All Courses</p>

      <div className="mb-10 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => handleDomainClick("")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
            !activeDomainId
              ? "bg-purple-600 text-white border-purple-600 shadow-md"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          All
        </button>
        {domains.map((domain) => (
          <button
            key={domain.id}
            onClick={() => handleDomainClick(String(domain.id))}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              activeDomainId === String(domain.id)
                ? "bg-purple-600 text-white border-purple-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {domain.name}
          </button>
        ))}
      </div>

      {courses.length === 0 && !loading ? (
        <div className="text-center py-12 text-slate-500">
          No courses available in this category.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || loading}
          className="rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:bg-slate-100 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2 text-sm font-semibold text-slate-700">
          Page {page}
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasMore || loading}
          className="rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:bg-slate-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
