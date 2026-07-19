import { Suspense } from "react";
import CoursesPageClient from "./courses-page-client";

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="px-10 py-20 text-center font-bold text-purple-600">Loading courses...</div>}>
      <CoursesPageClient />
    </Suspense>
  );
}