"use client";
import { useEffect, useState } from "react";

type Testimonial = {
  id: number | string;
  name: string;
  message: string;
  role?: string;
  location?: string;
  avatar?: string;
};

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Mark Thompson",
    role: "India",
    location: "India",
    avatar: "MT",
    message:
      "Amazing learning experience! The instructor was really knowledgeable and the platform is easy to navigate. I've completed multiple courses and can't wait for the ones coming to build.",
  },
  {
    id: 2,
    name: "Sarah Collins",
    role: "Canada",
    location: "Canada",
    avatar: "SC",
    message:
      "The quality and depth of content exceeded my expectations. I've completed multiple courses and each one helped me develop new skills and gain certifications.",
  },
  {
    id: 3,
    name: "James Walker",
    role: "United States",
    location: "United States",
    avatar: "JW",
    message:
      "This platform has truly been a game changer. I transitioned into a new career confidently, thanks to the practical projects and constant support from instructors.",
  },
  {
    id: 4,
    name: "Olivia Martinez",
    role: "United Kingdom",
    location: "United Kingdom",
    avatar: "OM",
    message:
      "I was able to get a promotion at work thanks to the comprehensive management courses. The interactive content made learning engaging and effective.",
  },
  {
    id: 5,
    name: "Emily Roberts",
    role: "United States",
    location: "United States",
    avatar: "ER",
    message:
      "These courses have been a game changer! I transitioned into a data science career confidently thanks to the practical projects and support from instructors.",
  },
  {
    id: 6,
    name: "Daniel Johnson",
    role: "United States",
    location: "United States",
    avatar: "DJ",
    message:
      "The lessons here have been a game changer. I was not sure about a career change but decided to try. The practical projects and support from instructors were amazing.",
  },
  
];

function AvatarCircle({ initials, index }: { initials: string; index: number }) {
  const colors = [
    "bg-purple-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-orange-400",
    "bg-teal-500",
    "bg-indigo-500",
  ];
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${colors[index % colors.length]}`}
    >
      {initials}
    </div>
  );
}

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTestimonials() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/testimonials", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        const list: Testimonial[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.testimonials)
          ? json.testimonials
          : [];

        if (list.length > 0) {
          setData(list);
          setUsingMock(false);
        } else {
          setData(MOCK_TESTIMONIALS);
          setUsingMock(true);
        }
      } catch (e: unknown) {
        const isAbortError =
          e instanceof DOMException
            ? e.name === "AbortError"
            : typeof e === "object" &&
              e !== null &&
              "name" in e &&
              (e as { name?: string }).name === "AbortError";

        if (!isAbortError) {
          // API unavailable — use mock data silently
          setData(MOCK_TESTIMONIALS);
          setUsingMock(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
    return () => controller.abort();
  }, []);

  const visibleData = usingMock ? data.slice(0, 6) : data;

  return (
    <section className="px-8 py-16 bg-white">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900">What Our Learners Are Saying</h2>
        <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
          Hear from students and professionals  transformed their careers and lives through our courses.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Grid */}
      {!loading && visibleData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {visibleData.map((t, index) => (
            <div
              key={t.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-3">
                {t.avatar && t.avatar.length <= 3 ? (
                  <AvatarCircle initials={t.avatar} index={index} />
                ) : t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <AvatarCircle
                    initials={t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                    index={index}
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{t.name}</p>
                  {(t.location || t.role) && (
                    <p className="text-xs text-gray-400">{t.location || t.role}</p>
                  )}
                </div>
              </div>

              {/* Stars */}
              <StarRating />

              {/* Message */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-5">{t.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && visibleData.length === 0 && (
        <p className="text-center text-gray-400 py-10">No testimonials available.</p>
      )}
    </section>
  );
}