
import Hero from "../components/HomeComponent/Hero";
import CoursesSection from "../components/HomeComponent/CoursesSection";
import CoursesCategory from "../components/HomeComponent/CoursesCategory";
import Testimonials from "../components/HomeComponent/Testimonials";
import Section2 from "../components/HomeComponent/section2";
import Sectionqus from "../components/HomeComponent/Sectionqus";


export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-[#F7F5FF] font-sans">
      <main className="bg-[#F7F5FF] font-sans">
        <Hero />
        <Section2 />
        <Sectionqus />
        <CoursesSection />
        <CoursesCategory />
        <Testimonials />
      </main>
    </div>
  );
}
