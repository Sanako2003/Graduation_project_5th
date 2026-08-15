// src/app/Assessment/page.tsx
import Navbar from "@/components/Navbar";
import QuizComponent from "@/components/Assessmentcomponent/QuizComponent";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col relative antialiased selection:bg-purple-100 selection:text-purple-900">
      <main className="flex-1">
        <QuizComponent />
      </main>
    </div>
  );
}