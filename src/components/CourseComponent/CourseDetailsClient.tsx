"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

type Lesson = {
  id: string;
  title: string;
  duration: string;
  isCompleted?: boolean;
};

type Course = {
  category: string;
  title: string;
  level: string;
  description: string;
  learningOutcomes?: string[];
  lessons?: Lesson[];
};

export default function CourseDetailsClient({ course }: { course: Course | null }) {
  const router = useRouter();
  const [activeLessonId, setActiveLessonId] = useState<string>("");

  if (!course) return <div className="text-center py-20 text-red-500">No Course Data Available</div>;

  const defaultLessonId = course.lessons?.[0]?.id ?? "";
  const activeLessonExists = course.lessons?.some((lesson) => lesson.id === activeLessonId);
  const currentActiveLessonId = activeLessonExists ? activeLessonId : defaultLessonId;

  const completedLessons = course.lessons ? course.lessons.filter((lesson) => lesson.isCompleted).length : 0;
  const progressPercentage = course.lessons && course.lessons.length > 0 
    ? Math.round((completedLessons / course.lessons.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      {/* زر العودة */}
      <div className="max-w-7xl mx-auto mb-6">
        <button onClick={() => router.push('/courses')} className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 font-medium text-sm transition-colors">
          <Icon icon="fluent:arrow-left-24-filled" className="w-4 h-4" /> Back to Courses
        </button>
      </div>

      {/* المحتوى المقسم لعمودين */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* العمود الأيسر: البانر والتفاصيل */}
        <div className="flex flex-col gap-8">
          <div className="relative w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2.5rem] p-8 md:p-14 overflow-hidden min-h-[300px] flex flex-col justify-center shadow-lg">
            <span className="bg-[#00E5FF] text-white text-xs font-black px-4 py-1.5 rounded-full w-fit mb-4">{course.category}</span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              How to effectively utilize <br /> <span className="text-yellow-300">{course.title}</span>?
            </h1>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{course.level} Level</span>
            <h3 className="text-lg font-extrabold text-slate-900 border-l-4 border-purple-600 pl-3 mt-6 mb-3">About this Course</h3>
            <p className="text-slate-600 leading-relaxed mb-6">{course.description}</p>

            <h3 className="text-lg font-extrabold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">What you will learn?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.learningOutcomes?.map((outcome: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                  <Icon icon="fluent:checkmark-circle-24-filled" className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <p className="text-sm text-slate-600 font-medium">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* العمود الأيمن: شريط الدروس والتقدم */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-6">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
            <span>Course Progress</span>
            <span className="text-purple-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
            <div className="bg-purple-600 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
          </div>

          <h4 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wide">Course Syllabus</h4>
          <div className="flex flex-col gap-2">
            {course.lessons?.map((lesson) => {
              const isActive = currentActiveLessonId === lesson.id;
              return (
                <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${isActive ? "bg-purple-50 border-purple-200 text-purple-700 font-bold" : "bg-white border-slate-100 text-slate-600"}`}>
                  <div className="flex items-center gap-3 truncate">
                    <Icon icon={lesson.isCompleted ? "fluent:checkmark-circle-24-filled" : "fluent:play-circle-24-regular"} className={`w-5 h-5 ${lesson.isCompleted ? "text-purple-500" : "text-slate-400"}`} />
                    <span className="text-sm truncate">{lesson.title}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{lesson.duration}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}