interface WhatYouLearnProps {
  title?: string;
  items: string[];
  className?: string;
}

export default function WhatYouLearn({
  title = "What you’ll Learn",
  items,
  className = "",
}: WhatYouLearnProps) {
  return (
    <section className={`bg-white rounded-xl border border-[#E4DDF5] shadow-sm p-5 ${className}`}>
      <h2 className="text-lg font-semibold text-[#172033]">{title}</h2>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
        {items.map((item, idx) => (
          <li key={`${item}-${idx}`} className="flex gap-2">
            <span className="text-purple-600">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
