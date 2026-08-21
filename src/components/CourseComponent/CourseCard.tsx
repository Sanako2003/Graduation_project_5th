import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    // التوجيه يعتمد على الـ ID ليدخل إلى المجلد [id]
    <Link href={`/courses/${course.id}`} className="block group cursor-pointer">
      <div className="overflow-hidden rounded-2xl border border-[#E4DDF5] bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-md">
        <img src={course.image} alt={course.title} className="w-full aspect-video object-cover rounded-xl" />
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
