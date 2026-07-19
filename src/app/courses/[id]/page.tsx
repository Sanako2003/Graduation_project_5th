"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseDetailsClient from "../../../components/CourseComponent/CourseDetailsClient";

// قاعدة بيانات وهمية متكاملة بـ IDs مطابقة لما يضغط عليه الطالب
const COURSES_DATABASE: Record<string, any> = {
  "101": {
    id: 101,
    title: "Artificial Intelligence & Deep Learning Masterclass",
    category: "Artificial Intelligence",
    level: "Advanced",
    description: "Master neural networks, computer vision, and NLP using PyTorch and TensorFlow from scratch.",
    learningOutcomes: ["Build deep neural networks from scratch.", "Deploy production-ready computer vision applications."],
    lessons: [
      { id: "ai-1", title: "Introduction to Neural Networks", duration: "12:00", isCompleted: true },
      { id: "ai-2", title: "CNN Architectures", duration: "18:30", isCompleted: false }
    ]
  },
  "102": {
    id: 102,
    title: "Cybersecurity Fundamentals: Defensive & Offensive",
    category: "Cybersecurity",
    level: "Beginner",
    description: "Learn core concepts of network security, infrastructure protection, and ethical hacking basics.",
    learningOutcomes: ["Understand core network security design.", "Identify system risks and protocol exploits."],
    lessons: [
      { id: "cy-1", title: "Security Frameworks Overview", duration: "15:10", isCompleted: true },
      { id: "cy-2", title: "Pentesting Environment Setup", duration: "24:45", isCompleted: false }
    ]
  }
};

export default function DynamicCoursePage() {
  const params = useParams();
  const courseId = params?.id ? String(params.id) : "";

  const [courseData, setCourseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      // إذا وجدنا الكورس في قاعدة البيانات الوهمية نضعه في الـ State
      if (COURSES_DATABASE[courseId]) {
        setCourseData(COURSES_DATABASE[courseId]);
      } else {
        // حماية مضافة: لو الـ ID قادم من الـ API الحقيقي (مثلاً 1 أو 2)، سنعرض الكورس الأول تلقائياً حتى لا تظهر الصفحة بيضاء!
        setCourseData(COURSES_DATABASE["101"]);
      }
      setLoading(false);
    }
  }, [courseId]);

  if (loading) return <div className="text-center py-20 font-bold text-purple-600">🔄 Loading Course Details...</div>;

  return (
    // هنا نمرر الكورس الفعلي كـ prop للمكون ليعرضه فوراً!
    <CourseDetailsClient course={courseData} />
  );
}