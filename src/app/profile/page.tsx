// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudentDashboard, StudentDashboard } from "@/lib/api";
import ProfileHeader from "@/components/StudentComponent/ProfileHeaderStudent";
import CourseCard from "@/components/StudentComponent/CourseCardStudent";
import AssessmentCard from "@/components/StudentComponent/AssessmentCardStudent";
import RecommendedCard from "@/components/StudentComponent/RecommendedCardStudent";
import AboutCard from "@/components/StudentComponent/AboutCard";
import SkillsCard from "@/components/StudentComponent/SkillCard";

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getStudentDashboard()
      .then(setData)
      .catch((err) => setError(err.message || "تعذّر تحميل بيانات البروفايل"))
      .finally(() => setLoading(false));
  }, [user]);

  // زائر → صفحة فاضية بدون تحويل تلقائي (متل ما اتفقنا)
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-4">
        <p className="text-slate-500 text-sm">
          هاي الصفحة متاحة فقط للمستخدمين المسجلين.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <p className="text-red-500 text-sm">{error || "لا توجد بيانات"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-10 space-y-6">
      <ProfileHeader
        student={{
          id: data.student.id,
          name: data.student.name,
          email: data.student.email,
          avatar: data.student.avatar ?? undefined,
          track: data.student.track,
          enrolledCourses: data.student.enrolledCourses,
          completedCourses: data.student.completedCourses,
          completionRate: data.student.completionRate,
          studyHours: data.student.studyHours,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AboutCard
          age={data.about.age ?? 0}
          educationLevel={data.about.educationLevel ?? "—"}
          studyHours={data.about.studyHours}
          location={data.about.location ?? "—"}
          github={data.about.github ?? undefined}
          interests={data.about.interests}
        />
        <SkillsCard skills={data.skills} />
      </div>

      {data.courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              progress={course.progress}
              status={course.status}
              language={course.language ?? undefined}
              level={course.level ?? undefined}
            />
          ))}
        </div>
      )}

      {data.assessments.length > 0 && (
        <div className="space-y-4">
          {data.assessments.map((a) => (
            <AssessmentCard
              key={a.id}
              title={a.title}
              date={a.date}
              score={a.score}
              color={a.color}
            />
          ))}
        </div>
      )}
    </main>
  );
}