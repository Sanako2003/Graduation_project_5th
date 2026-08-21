"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Course = {
  id: number;
  title: string;
};

type Domain = {
  id: number;
  name: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export default function Footer() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadFooterData() {
      try {
        const [coursesResponse, domainsResponse] = await Promise.all([
          fetch(`${API_URL}/courses?sort=trending&per_page=2`, {
            signal: controller.signal,
          }),
          fetch(`${API_URL}/domains`, {
            signal: controller.signal,
          }),
        ]);

        if (!coursesResponse.ok) {
          throw new Error(
            `Unable to load courses: ${coursesResponse.status}`
          );
        }

        if (!domainsResponse.ok) {
          throw new Error(
            `Unable to load domains: ${domainsResponse.status}`
          );
        }

        const coursesResult = await coursesResponse.json();
        const domainsResult = await domainsResponse.json();

        if (!active) {
          return;
        }

        setCourses((coursesResult.data ?? []).slice(0, 2));
        setDomains((domainsResult.data ?? []).slice(0, 5));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Footer loading error:", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFooterData();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <footer className="border-t border-white/10 bg-[#17122B] px-10 py-16 text-slate-300">
      <div className="grid gap-10 text-sm text-slate-400 md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-bold text-white">
            Popular Courses
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="mb-1 block transition-colors hover:text-violet-300"
              >
                {course.title}
              </Link>
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-bold text-white">
            Domains
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : domains.length > 0 ? (
            domains.map((domain) => (
              <Link
                key={domain.id}
                href={`/courses?domain_id=${domain.id}`}
                className="mb-1 block transition-colors hover:text-violet-300"
              >
                {domain.name}
              </Link>
            ))
          ) : (
            <p>No domains available</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-bold text-white">
            About
          </h3>

          <Link
            href="/about"
            className="mb-1 block transition-colors hover:text-violet-300"
          >
            About us
          </Link>

          <Link
            href="/careers"
            className="mb-1 block transition-colors hover:text-violet-300"
          >
            Careers
          </Link>
        </div>

        <div>
          <h3 className="mb-3 font-bold text-white">
            Community
          </h3>

          <Link
            href="/forums"
            className="mb-1 block transition-colors hover:text-violet-300"
          >
            Forums
          </Link>

          <Link
            href="/events"
            className="mb-1 block transition-colors hover:text-violet-300"
          >
            Events
          </Link>
        </div>
      </div>
    </footer>
  );
}
