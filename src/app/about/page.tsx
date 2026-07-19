export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-10 py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-purple-700 mb-2">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            We help learners grow with practical, modern courses.
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Our platform curates high-quality learning paths across design,
            development, business, and more — built for real-world skills, not
            just theory.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/courses"
              className="px-5 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
            >
              Explore Courses
            </a>
            <a
              href="/contact"
              className="px-5 py-3 rounded-xl border font-medium hover:bg-gray-50 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-10 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6">
            <p className="text-gray-500 text-sm mb-2">Focus</p>
            <h3 className="text-2xl font-bold">Skill-first learning</h3>
            <p className="text-gray-600 mt-2">
              Courses are designed around outcomes you can apply immediately.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-gray-500 text-sm mb-2">Quality</p>
            <h3 className="text-2xl font-bold">Curated instructors</h3>
            <p className="text-gray-600 mt-2">
              We pick creators with proven experience and clear teaching style.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-gray-500 text-sm mb-2">Support</p>
            <h3 className="text-2xl font-bold">Community & guidance</h3>
            <p className="text-gray-600 mt-2">
              Learn with others, get help, and stay motivated.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="px-10 py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We started this platform because finding the right course was
              always harder than it should be — too much noise, not enough
              structure, and unclear outcomes.
            </p>
            <p className="text-gray-600 leading-relaxed">
              So we built a place where every course has a clear goal, practical
              projects, and content that fits today’s market needs.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h3 className="text-xl font-bold mb-3">What we believe</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                Learning should be simple and organized.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                Skills matter more than certificates.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                Practice is the fastest way to progress.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                Great content needs great UI/UX.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-10 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Meet the team</h2>
          <p className="text-gray-600 mb-8">
            A small team obsessed with building a better learning experience.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Your Name", role: "Founder / Product" },
              { name: "Team Member", role: "Frontend Developer" },
              { name: "Team Member", role: "Content & Curation" },
            ].map((member) => (
              <div
                key={member.name + member.role}
                className="rounded-2xl border p-6 hover:shadow-sm transition bg-white"
              >
                <div className="h-14 w-14 rounded-2xl bg-purple-100 mb-4" />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-16 bg-purple-600 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ready to start learning?</h2>
            <p className="text-white/90">
              Browse courses, pick a category, and begin today.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/courses"
              className="px-5 py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-white/90 transition"
            >
              Browse Courses
            </a>
            <a
              href="/contact"
              className="px-5 py-3 rounded-xl border border-white/30 font-semibold hover:bg-white/10 transition"
            >
              Contact
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
