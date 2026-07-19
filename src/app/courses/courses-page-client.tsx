"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourseCard from "@/components/CourseComponent/CourseCard";

interface Course {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  slug: string;
}

// 1. مصفوفة الكورسات الوهمية (Mock Data) لتطابق التخصصات التي حددناها سابقاً في التقييم
const MOCK_COURSES: Course[] = [
  {
    id: 101,
    title: "Artificial Intelligence & Deep Learning Masterclass",
    category: "Artificial Intelligence",
    price: 199,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600",
    slug: "ai-deep-learning"
  },
  {
    id: 102,
    title: "Cybersecurity Fundamentals: Defensive & Offensive",
    category: "Cybersecurity",
    price: 149,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600",
    slug: "cybersecurity-fundamentals"
  },
  {
    id: 103,
    title: "Next.js 14 & TypeScript: The Complete Guide",
    category: "Software Engineering",
    price: 129,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600",
    slug: "nextjs-typescript-complete"
  },
  {
    id: 104,
    title: "UI/UX Advanced Design Systems with Figma",
    category: "UI/UX Design",
    price: 99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?q=80&w=600",
    slug: "ui-ux-design-systems"
  },
  {
    id: 105,
    title: "Product Management: From Blueprint to Launch",
    category: "Product Management",
    price: 159,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600",
    slug: "product-management-blueprint"
  },
  {
    id: 106,
    title: "Ultimate Unity & C# Game Development",
    category: "Game Development",
    price: 119,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600",
    slug: "unity-game-development"
  }
];

export default function CoursesPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFromUrl = searchParams.get("category") || "All";

  // 2. جعل الحالة الافتراضية تبدأ بالبيانات الوهمية بدلاً من مصفوفة فارغة لضمان عدم جمود الصفحة
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  
  // توليد الفئات الافتراضية من البيانات الوهمية مباشرة عند البداية
  const [categories, setCategories] = useState<string[]>([
    "All",
    ...Array.from(new Set(MOCK_COURSES.map((c) => c.category))),
  ]);
  
  const [activeCategory, setActiveCategory] = useState<string>(categoryFromUrl);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:4000/courses");
        if (!res.ok) throw new Error("Server not responding");
        
        const data: Course[] = await res.json();

        // إذا جاءت بيانات حقيقية من الـ API بنجاح، نستبدل الوهمي فوراً
        if (data && data.length > 0) {
          setCourses(data);
          const uniqueCategories = [
            "All",
            ...Array.from(new Set(data.map((c) => c.category))),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        // في حال فشل السيرفر المحرك أو الـ localhost غير متاح، الكود سيتجاهل الخطأ ويبقى عارضاً للبيانات الوهمية بسلاسة
        console.warn("Using fallback mock data because API is offline:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const filteredCourses = useMemo(() => {
    if (activeCategory === "All") return courses;
    return courses.filter((c) => c.category === activeCategory);
  }, [courses, activeCategory]);

  function handleCategoryClick(cat: string) {
    if (cat === "All") router.push("/courses");
    else router.push(`/courses?category=${encodeURIComponent(cat)}`);
  }

  return (
    <section className="px-10 py-20">
      <p className="mb-2 text-sm font-semibold text-purple-700">
        All Courses
      </p>

      <div className="mb-10 flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat 
                ? "bg-purple-600 text-white border-purple-600 shadow-md" 
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* حماية إضافية في حال كانت المصفوفة فارغة تماماً */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No courses available in this category.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}