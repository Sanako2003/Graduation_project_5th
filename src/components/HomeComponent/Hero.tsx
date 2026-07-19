// components/Hero.tsx
"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Play, Sparkles, Zap, BookOpen, Users, Star } from "lucide-react";

const heroImages = [
  { src: "/images/hero1.jpg", alt: "Books and learning", color: "bg-purple-400" },
  { src: "/images/hero2.jpg", alt: "Team studying", color: "bg-blue-400" },
  { src: "/images/hero3.jpg", alt: "AI Technology", color: "bg-pink-400" },
  { src: "/images/hero4.jpg", alt: "Programming", color: "bg-indigo-400" },
  { src: "/images/hero5.jpg", alt: "Online learning", color: "bg-rose-400" },
  { src: "/images/hero6.jpg", alt: "Mobile learning", color: "bg-cyan-400" },
  { src: "/images/hero7.jpg", alt: "Creative workspace", color: "bg-amber-400" },
];

// مكون العداد المتحرك
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div ref={countRef} className="text-3xl font-bold text-purple-600">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rotations = [12, -8, 15, -12, 10, -15, 8];
  const positions = [
    "top-0 left-12",
    "top-20 right-8",
    "top-52 left-4",
    "top-80 right-16",
    "bottom-20 left-20",
    "bottom-12 right-24",
    "top-36 left-1/2",
  ];

  if (!mounted) {
    return null; // أو loading spinner
  }

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden pt-30 pb-20">
      {/* خلفية متحركة بسيطة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* النص الجانب الأيسر */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium animate-bounce-slow">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Start your journey today</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter text-gray-900">
            Empower Your Career with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 animate-gradient">
              Practical Learning Paths
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-lg">
            Flexible, affordable courses designed to help you achieve your goals, 
           at home, in the office, or anywhere in between.
          </p>
          

         <div className="flex flex-wrap gap-4">
  {/* الزر الأساسي - Start Learning Free */}
  <button className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 flex items-center gap-2">
    Start Learning Free
    <Zap className="w-5 h-5 group-hover:animate-bounce" />
  </button>
  
  {/* الزر الثانوي - Watch 2-min Video */}
  <button className="group border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 px-8 py-4 rounded-2xl font-medium text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3 bg-white">
    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
      <Play className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors ml-0.5" />
    </div>
    <span className="text-gray-900 group-hover:text-purple-600 transition-colors">Watch 2-min Video</span>
  </button>
</div>
          {/* إحصائيات */}
          <div className="flex gap-10 pt-6">
            <div className="group hover:-translate-y-1 transition-transform cursor-default">
              <AnimatedCounter target={50} suffix="k+" />
              <p className="text-gray-500 flex items-center gap-1 group-hover:text-purple-600 transition-colors">
                <Users className="w-4 h-4" /> Active Students
              </p>
            </div>
            <div className="group hover:-translate-y-1 transition-transform cursor-default">
              <AnimatedCounter target={450} suffix="+" />
              <p className="text-gray-500 flex items-center gap-1 group-hover:text-purple-600 transition-colors">
                <BookOpen className="w-4 h-4" /> Courses
              </p>
            </div>
            <div className="group hover:-translate-y-1 transition-transform cursor-default">
              <AnimatedCounter target={4} suffix=".9" />
              <p className="text-gray-500 flex items-center gap-1 group-hover:text-purple-600 transition-colors">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Average Rating
              </p>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن - Collage */}
        <div className="relative h-[620px] hidden md:block">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute ${positions[index]} w-52 h-52 md:w-64 md:h-64 shadow-2xl rounded-3xl overflow-hidden cursor-pointer group animate-float`}
              style={{
                transform: `rotate(${rotations[index]}deg)`,
                animationDelay: `${index * 0.2}s`,
                zIndex: 10 + (index % 5),
              }}
            >
              {/* إذا الصورة موجودة تستخدمها، إذا لا تستخدم لون */}
              <div className={`w-full h-full ${image.color} relative`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  onError={(e) => {
                    // إذا فشل تحميل الصورة، نخلي الـ div يظهر
                    e.currentTarget.style.display = 'none';
                  }}
                  unoptimized
                />
                {/* نص بديل إذا مافي صورة */}
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg opacity-100 group-hover:opacity-0 transition-opacity">
                  {image.alt}
                </div>
              </div>
              
              {/* تأثير الهوفر */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/0 to-white/0 group-hover:from-purple-600/20 group-hover:to-white/20 transition-all duration-500" />
              <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/50 transition-all duration-500 group-hover:scale-105" />
            </div>
          ))}

          {/* دائرة توهج */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl -z-10 animate-pulse" />
        </div>
      </div>

      {/* CSS للانميشنات */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 2deg));
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-float {
          --rotation: ${(props: any) => props.style?.transform || '0deg'};
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}