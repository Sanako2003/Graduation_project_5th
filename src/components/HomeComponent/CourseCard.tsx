type Course = {
  id: number;
  title: string;
  price: number;
  average_rating: number;
  image: string;
  students?: number;
  enrolledText?: string;
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer">
      
      {/* IMAGE */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* RATING + STUDENTS */}
        <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
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

          <span className="text-sm font-bold text-gray-900">
            ${course.price}
          </span>
        </div>
      </div>
    </div>
  );
}