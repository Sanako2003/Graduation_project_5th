import ProfileHeader from "@/components/StudentComponent/ProfileHeaderStudent";
import CourseCard from "@/components/StudentComponent/CourseCardStudent";
import AssessmentCard from "@/components/StudentComponent/AssessmentCardStudent";
import RecommendedCard from "@/components/StudentComponent/RecommendedCardStudent";
import AboutCard from "@/components/StudentComponent/AboutCard";
import SkillsCard from "@/components/StudentComponent/SkillCard";

function getStudentData() {
  return {
    student: {
      id: 1,
      name: "Ahmad Hassan",
      email: "ahmad.hassan@example.com",
      avatar: "",
      track: "Computer Science",
      joinDate: "2023-09-01",
      gpa: 3.8,
      age: 21,
      level: "Undergraduate",
      enrolledCourses: 12,
      completedCourses: 7,
      completionRate: 94,
      studyHours: 328,
    },
    myCourses: [
      {
        id: 1,
        title: "Intro to Python",
        progress: 100,
        status: "completed" as const,
        language: "Python",
        level: "Beginner",
      },
      {
        id: 2,
        title: "PHP Full Stack Bootcamp",
        progress: 65,
        status: "in-progress" as const,
        language: "PHP",
        level: "Intermediate",
      },
      {
        id: 3,
        title: "Web Development Fundamentals",
        progress: 0,
        status: "enrolled" as const,
        language: "HTML/CSS",
        level: "Beginner",
      },
    ],
    assessments: [
      {
        id: 1,
        title: "Midterm Exam - Programming",
        date: "2024-03-15",
        score: 85,
        color: "purple" as const,
      },
      {
        id: 2,
        title: "Quiz - Data Structures",
        date: "2024-03-20",
        score: 92,
        color: "green" as const,
      },
      {
        id: 3,
        title: "Final Project - Web Dev",
        date: "2024-03-25",
        score: 88,
        color: "orange" as const,
      },
    ],
    recommended: [
      {
        id: 1,
        title: "Advanced JavaScript",
        instructor: "Dr. Sarah Ahmed",
        rating: 4.8,
        students: 1250,
      },
      {
        id: 2,
        title: "Database Management",
        instructor: "Prof. Omar Hassan",
        rating: 4.6,
        students: 980,
      },
      {
        id: 3,
        title: "Mobile App Development",
        instructor: "Dr. Layla Ibrahim",
        rating: 4.9,
        students: 1500,
      },
    ],
  };
}

export default function ProfilePage() {
  const { student, myCourses, assessments, recommended } = getStudentData();

  const aboutData = {
    age: 21,
    educationLevel: "Undergraduate - Year 3",
    studyHours: 25,
    location: "Baghdad, Iraq",
    github: "github.com/ahmad-hassan",
    interests: [
      "Web Development",
      "AI & Machine Learning",
      "Mobile Apps",
      "Cloud Computing",
    ],
  };

  const skillsData = [
    { name: "Python", percentage: 90, color: "purple" },
    { name: "JavaScript", percentage: 78, color: "orange" },
    { name: "React", percentage: 70, color: "cyan" },
    { name: "SQL", percentage: 65, color: "blue" },
    { name: "PHP", percentage: 55, color: "pink" },
    { name: "Node.js", percentage: 48, color: "green" },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FB] relative overflow-hidden font-sans pb-20">
      
      {/* حقن حركات السير الدقيقة وتغيير الألوان التفاعلية للأشكال الهندسية ذاتها */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fluid-shape-1 {
          0%, 100% { transform: translateY(0px) rotate(12deg) scale(1); filter: hue-rotate(0deg); }
          50% { transform: translateY(-30px) translateX(15px) rotate(20deg) scale(1.05); filter: hue-rotate(45deg); }
        }
        @keyframes fluid-shape-2 {
          0%, 100% { transform: translateY(0px) rotate(-12deg) scale(1); filter: hue-rotate(0deg); }
          50% { transform: translateY(25px) translateX(-20px) rotate(-6deg) scale(0.95); filter: hue-rotate(-45deg); }
        }
        @keyframes fluid-shape-3 {
          0%, 100% { transform: translate(0px, 0px) rotate(45deg); filter: hue-rotate(0deg) brightness(1); }
          50% { transform: translate(-20px, 15px) rotate(60deg); filter: hue-rotate(30deg) brightness(1.15); }
        }
        .animate-fluid-1 { animation: fluid-shape-1 14s ease-in-out infinite; }
        .animate-fluid-2 { animation: fluid-shape-2 16s ease-in-out infinite; }
        .animate-fluid-3 { animation: fluid-shape-3 18s ease-in-out infinite; }
      `}} />

      {/* ------------------ شبكة المربعات الهندسية الحية الملونة والتفاعلية ------------------ */}
      
      {/* 1. مربع مرجاني أحمر متدرج إلى البنفسجي - علوي يسار */}
      <div className="absolute top-6 left-[-50px] w-72 h-72 bg-gradient-to-br from-[#E37D73]/35 to-[#4E37D3]/25 rounded-[2.5rem] pointer-events-none shadow-md animate-fluid-1" />
      
      {/* 2. مربع بنفسجي ملكي متدرج إلى الـ Lavender - علوي يمين */}
      <div className="absolute top-14 right-[-40px] w-64 h-64 bg-gradient-to-bl from-[#4E37D3]/40 to-[#8B5CF6]/30 rounded-[2.2rem] pointer-events-none shadow-lg animate-fluid-2" />
      
      {/* 3. مربع فيروزي مضيء متدرج إلى الأخضر الزمردي - علوي منتصف */}
      <div className="absolute top-48 right-[25%] w-40 h-40 bg-gradient-to-tr from-[#06B6D4]/35 to-[#10B981]/20 rounded-[1.8rem] pointer-events-none blur-[0.5px] animate-fluid-3" />
      
      {/* 4. مربع برتقالي ذهبي متدرج إلى الأحمر المرجاني - منتصف يسار */}
      <div className="absolute top-[22%] left-[-30px] w-56 h-56 bg-gradient-to-r from-[#F59E0B]/30 to-[#E37D73]/25 rounded-[2rem] pointer-events-none animate-fluid-2" />
      
      {/* 5. مربع وردي فاقع متدرج إلى الأرجواني الفخم - منتصف يمين */}
      <div className="absolute top-[32%] right-[-20px] w-60 h-60 bg-gradient-to-l from-[#EC4899]/30 to-[#8B5CF6]/25 rounded-[2.5rem] pointer-events-none animate-fluid-1" />
      
      {/* 6. مربع أزرق نيون ساطع متدرج إلى الفيروزي - تحت البرتقالي يسار */}
      <div className="absolute top-[42%] left-[8%] w-48 h-48 bg-gradient-to-tr from-[#3B82F6]/35 to-[#06B6D4]/20 rounded-[1.8rem] pointer-events-none animate-fluid-3" />
      
      {/* 7. مربع أخضر زمردي ناعم متدرج إلى الأصفر الليموني - منتصف خلف الكروت */}
      <div className="absolute top-[55%] right-[15%] w-44 h-44 bg-gradient-to-br from-[#10B981]/25 to-[#EAB308]/15 rounded-[1.5rem] pointer-events-none animate-fluid-2" />
      
      {/* 8. مربع أرجواني / لاوندر متدرج إلى الأزرق النيلي - سفلي يسار */}
      <div className="absolute bottom-[28%] left-[-40px] w-64 h-64 bg-gradient-to-tr from-[#8B5CF6]/35 to-[#2563EB]/20 rounded-[2.5rem] pointer-events-none animate-fluid-1" />
      
      {/* 9. مربع أصفر ليموني منعش متدرج إلى البرتقالي الدافئ - سفلي يمين */}
      <div className="absolute bottom-[16%] right-[-30px] w-56 h-56 bg-gradient-to-bl from-[#EAB308]/30 to-[#F59E0B]/20 rounded-[2rem] pointer-events-none animate-fluid-3" />
      
      {/* 10. مربع أزرق نيلي عميق متدرج إلى البنفسجي - سفلي منتصف */}
      <div className="absolute bottom-6 left-[35%] w-80 h-48 bg-gradient-to-r from-[#2563EB]/35 to-[#4E37D3]/25 rounded-[2.2rem] pointer-events-none blur-[1px] animate-fluid-1" />
      
      {/* غشاء دمج ناعم جداً لضمان عدم حدوث تشتيت بصري حاد أثناء الحركة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAEFF7]/10 via-transparent to-[#E3E9F8]/20 pointer-events-none" />

      {/* ---------------------------------------------------------------------------- */}

      {/* محتوى الصفحة الرئيسي */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 space-y-12">
        
        {/* Profile Header بحاوية زجاجية نقية وراقية تطفو وتبرز فوق ألوان الخلفية */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-3 shadow-xl border border-white/80 transition-all duration-500 hover:bg-white/95 hover:border-[#4E37D3]/20">
          <ProfileHeader student={student} />
        </div>

        {/* About & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <AboutCard {...aboutData} />
          </div>
          <div className="transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <SkillsCard skills={skillsData} />
          </div>
        </div>

        {/* My Courses */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[#1A253C] text-sm font-bold uppercase tracking-widest">
              MY COURSES
            </h2>
            <a 
              href="/mycourses" 
              className="text-[#4E37D3] hover:text-[#3b27ad] font-semibold text-sm transition-colors flex items-center gap-1 group"
            >
              See all <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((c) => (
              <div key={c.id} className="transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <CourseCard
                  title={c.title}
                  progress={c.progress}
                  status={c.status}
                  language={c.language}
                  level={c.level}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Assessments History */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[#1A253C] text-2xl font-bold">Assessments History</h2>
            <a href="/assessments" className="text-[#4E37D3] hover:text-[#3b27ad] font-semibold transition-colors group">
              See all <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((a) => (
              <div key={a.id} className="transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <AssessmentCard
                  title={a.title}
                  date={new Date(a.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  score={a.score}
                  color={a.color}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Recommended For You */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[#1A253C] text-2xl font-bold">Recommended For You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((r) => (
              <div key={r.id} className="transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <RecommendedCard
                  title={r.title}
                  instructor={r.instructor}
                  rating={r.rating}
                  students={r.students}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}