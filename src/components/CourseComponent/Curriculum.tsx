// في Curriculum.tsx - غير Interface
type LessonType = {
  title: string;
  duration?: string;  // اختياري
  type?: string;      // اختياري
};

interface CurriculumProps {
  title?: string;
  modules: {
    title: string;
    lessons?: LessonType[];  // 👈 غير من string[] إلى LessonType[]
  }[];
  className?: string;
}

export default function Curriculum({
  title = "Course Curriculum Breakdown",
  modules,
  className = "",
}: CurriculumProps) {
  return (
    <section className={`bg-white rounded-xl shadow p-5 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      <div className="mt-4 space-y-3">
        {modules.map((m, i) => (
          <details
            key={`${m.title}-${i}`}
            className="group rounded-xl border border-gray-100 px-4 py-3"
          >
            <summary className="cursor-pointer list-none font-medium text-gray-800 flex items-center justify-between">
              <span>
                Module {i + 1}: {m.title}
              </span>
              <span className="text-gray-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>

            {m.lessons?.length ? (
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {m.lessons.map((lesson, idx) => (
                  <li 
                    key={`${lesson.title}-${idx}`} 
                    className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <div className="flex-1">
                      <span className="font-medium">{lesson.title}</span>
                      {lesson.duration && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({lesson.duration})
                        </span>
                      )}
                    </div>
                    {lesson.type && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {lesson.type}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}