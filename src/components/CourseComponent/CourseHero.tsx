import Image from "next/image";
import Link from "next/link";

type Cta = {
  label: string;
  href: string;
};

interface CourseHeroProps {
  title: string;
  subtitle?: string;
  description: string;

  rating: number; // مثال 5.0
  enrolledText: string; // مثال "2,500+ enrolled"

  image: string;
  imageAlt: string;

  primaryCta: Cta;
  secondaryCta?: Cta;

  className?: string;
}

export default function CourseHero({
  title,
  subtitle,
  description,
  rating,
  enrolledText,
  image,
  imageAlt,
  primaryCta,
  secondaryCta,
  className = "",
}: CourseHeroProps) {
  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Text */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              {title}
              {subtitle ? (
                <>
                  <br />
                  <span className="text-gray-800">{subtitle}</span>
                </>
              ) : null}
            </h1>

            <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>

            <div className="mt-5 flex items-center gap-3 text-sm text-gray-600">
              <span>⭐ {rating.toFixed(1)}</span>
              <span className="text-gray-300">•</span>
              <span>{enrolledText}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-white bg-purple-600 hover:bg-purple-700 transition"
              >
                {primaryCta.label}
              </Link>

              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>

          {/* Image */}
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow">
            <Image
              src={image}
              alt={imageAlt}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
