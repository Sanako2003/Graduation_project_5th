import CourseCard from "./CourseCard";

type Course = {
  id: number;
  title: string;
  price: number;
  rating: number;
  image: string;
  students: number;
};

async function getCourses(): Promise<Course[]> {
  // ✅ Mock Data بدل API
  return [
    {
      id: 1,
      title: "The Advanced Web Developer Bootcamp",
      price: 49,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      students: 31000,
    },
    {
      id: 2,
      title: "The Complete 2024 PHP Full Stack Bootcamp",
      price: 49,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      students: 42000,
    },
    {
      id: 3,
      title: "Frontend Web Development with React",
      price: 59,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      students: 50000,
    },
    {
      id: 4,
      title: "UI/UX Design Bootcamp",
      price: 39,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      students: 28000,
    },
  ];
}

export default async function CoursesSection() {
  const courses = await getCourses();

  return (
    <section className="py-20 bg-[#f8f7fc]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Trending Courses Across Diverse Fields
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Handpicked courses across various categories to help you achieve your learning goals.
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-6 overflow-x-auto mb-10 text-sm font-medium">
          {[
            "Technology & Software",
            "IT & Software",
            "Design & Creative arts",
            "Business & Management",
            "Health & Wellness",
            "Marketing",
            "Lifestyle",
          ].map((cat, i) => (
            <button
              key={i}
              className={`pb-2 whitespace-nowrap border-b-[2px] ${
                i === 0
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-500 border-transparent hover:text-purple-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* COURSES */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* ARROWS */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="w-10 h-10 rounded-full border bg-white shadow flex items-center justify-center hover:bg-gray-100">
            ←
          </button>
          <button className="w-10 h-10 rounded-full border bg-white shadow flex items-center justify-center hover:bg-gray-100">
            →
          </button>
        </div>

      </div>
    </section>
  );
}