type Course = {
  id: number;
  title: string;
  category?: string;
  price: number;
  average_rating: number;
  image: string;
  students?: number;
  enrolledText?: string;
};

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
  const fallbackLabel = course.category || "Course";
  const hasImage = Boolean(course.image && !course.image.includes("placehold.co"));

  return (
    <div className="bg-white rounded-2xl border border-[#E4DDF5] shadow-sm hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer">
      
      {/* IMAGE */}
      <div className="h-40 w-full overflow-hidden">
        {hasImage ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getFallbackGradient(fallbackLabel)}`}>
            <div className="px-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
                {fallbackLabel}
              </p>
              <p className="mt-2 text-3xl font-black text-white">
                {getInitials(fallbackLabel) || "MS"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#172033] line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* RATING + STUDENTS */}
        <div className="flex items-center gap-3 mt-3 text-sm text-slate-500">
          <span className="text-yellow-500">⭐ {course.average_rating}</span>
          <span>
            {course.students
              ? `${course.students.toLocaleString()} students`
              : course.enrolledText || ""}
          </span>
        </div>

        {/* AVATARS + PRICE */}
        <div className="flex items-center justify-between mt-4">
          
          <div className="flex -space-x-2">
            <img className="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=1"/>
            <img className="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=2"/>
            <img className="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=3"/>
          </div>

          <span className="text-sm font-bold text-[#172033]">
            ${course.price}
          </span>
        </div>
      </div>
    </div>
  );
}
