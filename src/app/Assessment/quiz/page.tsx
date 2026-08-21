// src/app/Assessment/page.tsx
import Navbar from "@/components/Navbar";
import QuizComponent from "@/components/Assessmentcomponent/QuizComponent";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#F7F5FF] flex flex-col relative antialiased selection:bg-violet-100 selection:text-violet-900">
      <main className="flex-1">
        <QuizComponent />
      </main>
    </div>
  );
}
