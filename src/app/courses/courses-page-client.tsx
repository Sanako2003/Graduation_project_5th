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
  const searchFromUrl = searchParams.get("search") || "";
  const pageFromUrl = Number(searchParams.get("page") || "1");

  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(pageFromUrl);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDomainId, setActiveDomainId] = useState<string>(domainIdFromUrl);
  const [activeSearch, setActiveSearch] = useState<string>(searchFromUrl);
  const [searchInput, setSearchInput] = useState<string>(searchFromUrl);

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
    async (
      targetPage: number,
      domainId: string,
      categoryName: string,
      searchTerm: string,
    ) => {
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
        if (searchTerm) {
          params.set("search", searchTerm);
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
    setActiveSearch(searchFromUrl);
    setSearchInput(searchFromUrl);
    setPage(pageFromUrl);
    loadCourses(pageFromUrl, targetDomainId, categoryFromUrl, searchFromUrl);
  }, [categoryFromUrl, domainIdFromUrl, searchFromUrl, domains, pageFromUrl, loadCourses]);

  const handleDomainClick = (domainId: string) => {
    const params = new URLSearchParams();
    if (domainId) params.set("domain_id", domainId);
    if (activeSearch) params.set("search", activeSearch);
    params.set("page", "1");
    router.push(`/courses?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (activeDomainId) params.set("domain_id", activeDomainId);
    if (activeSearch) params.set("search", activeSearch);
    params.set("page", String(newPage));
    router.push(`/courses?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (activeDomainId) params.set("domain_id", activeDomainId);
    const trimmed = searchInput.trim();
    if (trimmed) params.set("search", trimmed);
    params.set("page", "1");
    router.push(`/courses?${params.toString()}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams();
    if (activeDomainId) params.set("domain_id", activeDomainId);
    params.set("page", "1");
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <section className="min-h-screen bg-[#F7F5FF] px-10 py-10">
      <p className="mb-2 text-sm font-semibold text-violet-700">All Courses</p>

      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search courses..."
            className="w-full rounded-full border border-[#E4DDF5] bg-white px-5 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
          />
          {activeSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-violet-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => handleDomainClick("")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
            !activeDomainId
              ? "bg-violet-600 text-white border-violet-600 shadow-md"
              : "bg-white text-slate-600 border-[#E4DDF5] hover:border-violet-300 hover:bg-violet-50"
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
                ? "bg-violet-600 text-white border-violet-600 shadow-md"
                : "bg-white text-slate-600 border-[#E4DDF5] hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            {domain.name}
          </button>
        ))}
      </div>

      {courses.length === 0 && !loading ? (
        <div className="text-center py-12 text-slate-500">
          {activeSearch
            ? `No courses found for "${activeSearch}".`
            : "No courses available in this category."}
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
          className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2 text-sm font-semibold text-slate-700">
          Page {page}
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasMore || loading}
          className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
