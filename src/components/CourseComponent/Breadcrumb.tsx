import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string; 
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm text-gray-500 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-gray-700">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-800 font-medium" : ""}>
                  {item.label}
                </span>
              )}

              {!isLast ? <span className="text-gray-300">{">"}</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
