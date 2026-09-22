import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

const fallbackGradients = [
  "from-[#6D28D9] via-[#A21CAF] to-[#4F46E5]",
  "from-teal-500 via-cyan-500 to-blue-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-blue-500 via-indigo-500 to-violet-600",
];

function getFallbackGradient(seed: string) {
  const value = seed
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return fallbackGradients[value % fallbackGradients.length];
}

function getInitials(label: string) {
  return label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function CourseCard({ course }: { course: Course }) {
  const hasImage = Boolean(course.image && !course.image.includes("placehold.co"));

  return (
    // التوجيه يعتمد على الـ ID ليدخل إلى المجلد [id]
    <Link href={`/courses/${course.id}`} className="block group cursor-pointer">
      <div className="overflow-hidden rounded-2xl border border-[#E4DDF5] bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-md">
        {hasImage ? (
          <img src={course.image} alt={course.title} className="w-full aspect-video object-cover rounded-xl" />
        ) : (
          <div className={`flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br ${getFallbackGradient(course.category)}`}>
            <div className="px-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
                {course.category}
              </p>
              <p className="mt-2 text-3xl font-black text-white">
                {getInitials(course.category) || "MS"}
              </p>
            </div>
          </div>
        )}
        <h3 className="mt-2 font-bold text-slate-800 group-hover:text-violet-600 transition-colors">{course.title}</h3>
        <p className="text-violet-600 text-xs font-semibold mt-1">{course.category}</p>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span className="flex items-center gap-1 text-yellow-500">⭐ {course.rating?.toFixed(1) ?? '0.0'}</span>
          <span className="font-semibold text-[#172033]">${course.price}</span>
        </div>
      </div>
    </Link>
  );
}
