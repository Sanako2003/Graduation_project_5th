import Link from "next/link";

interface CourseSidebarProps {
  title?: string;
  features: (string | { icon?: string; text: string })[];
  ctaLabel?: string;
  ctaHref: string;
  className?: string;
}

export default function CourseSidebar({
  title = "Course Features",
  features,
  ctaLabel = "Buy Now",
  ctaHref,
  className = "",
}: CourseSidebarProps) {
  return (
    <aside className={className}>
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        <ul className="mt-4 space-y-3">
          {features.map((item, idx) => {
            // تحقق من نوع البيانات
            const isObject = item && typeof item === 'object' && 'text' in item;
            const text = isObject ? (item as any).text : String(item);
            const icon = isObject ? (item as any).icon : "✓";

            return (
              <li key={`${text}-${idx}`} className="flex items-start gap-3 py-2">
                <span className="text-xl mt-0.5">{icon}</span>
                <span className="text-gray-800 font-medium">{text}</span>
              </li>
            );
          })}
        </ul>

        <Link
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 font-semibold text-white hover:bg-purple-700 transition"
        >
          {ctaLabel}
        </Link>
      </div>
    </aside>
  );
}