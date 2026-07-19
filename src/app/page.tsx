
import Hero from "../components/HomeComponent/Hero";
import CoursesSection from "../components/HomeComponent/CoursesSection";
import CoursesCategory from "../components/HomeComponent/CoursesCategory";
import Testimonials from "../components/HomeComponent/Testimonials";
import Section2 from "../components/HomeComponent/section2";
import Sectionqus from "../components/HomeComponent/Sectionqus";


export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans bg-gradient-to-b from-purple-50 to-white">
      <main className="bg-zinc-50 font-sans">
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
