"use client";

import { useEffect, useState, useCallback } from "react";
import CourseCard from "./CourseCard";

type Course = {
  id: number;
  title: string;
  price: number;
  average_rating: number;
  image: string;
  students?: number;
  enrolledText?: string;
};

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/courses?per_page=4&page=${pageNumber}`,
        { cache: "no-store" },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch home courses");
      }

      const result = await res.json();
      const coursesArray = Array.isArray(result) ? result : result.data || [];

      if (!Array.isArray(coursesArray)) {
        setCourses([]);
        return;
      }

      setCourses(
        coursesArray.map((c: any) => ({
          id: c.id,
          title: c.title,
          price: Number(c.price) || 0,
          average_rating: Number(c.average_rating) || 0,
          image: c.image || "https://placehold.co/600x400",
          students: c.students_count || 0,
          enrolledText: c.enrolledText || "",
        })),
      );
      setHasMore(Array.isArray(coursesArray) && coursesArray.length === 4);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(page);
  }, [page, fetchCourses]);

  const pageNumbers = [page];

  return (
    <section className="py-12 bg-[#EEE9FF]">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#172033]">
            Our Popular Courses
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500 py-6">
              {loading ? "Loading courses..." : "No courses found."}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || loading}
            className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-sm font-semibold text-slate-700">
            Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMore || loading}
            className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
