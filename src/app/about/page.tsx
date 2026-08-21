export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F5FF] text-[#172033]">
      {/* Hero */}
      <section className="px-10 py-16 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-violet-100 mb-2">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            We help learners grow with practical, modern courses.
          </h1>
          <p className="text-violet-100 text-lg max-w-2xl">
            Our platform curates high-quality learning paths across design,
            development, business, and more — built for real-world skills, not
            just theory.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/courses"
              className="px-5 py-3 rounded-xl bg-white text-violet-700 font-medium hover:bg-violet-50 transition"
            >
              Explore Courses
            </a>
            <a
              href="/contact"
              className="px-5 py-3 rounded-xl border border-white/30 font-medium text-white hover:bg-white/10 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-10 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-2">Focus</p>
            <h3 className="text-2xl font-bold">Skill-first learning</h3>
            <p className="text-slate-600 mt-2">
              Courses are designed around outcomes you can apply immediately.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-2">Quality</p>
            <h3 className="text-2xl font-bold">Curated instructors</h3>
            <p className="text-slate-600 mt-2">
              We pick creators with proven experience and clear teaching style.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-2">Support</p>
            <h3 className="text-2xl font-bold">Community & guidance</h3>
            <p className="text-slate-600 mt-2">
              Learn with others, get help, and stay motivated.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="px-10 py-14 bg-[#EEE9FF]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our story</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We started this platform because finding the right course was
              always harder than it should be — too much noise, not enough
              structure, and unclear outcomes.
            </p>
            <p className="text-slate-600 leading-relaxed">
              So we built a place where every course has a clear goal, practical
              projects, and content that fits today’s market needs.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">What we believe</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-600" />
                Learning should be simple and organized.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-600" />
                Skills matter more than certificates.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-600" />
                Practice is the fastest way to progress.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-600" />
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
          <p className="text-slate-600 mb-8">
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
                className="rounded-2xl border border-[#E4DDF5] p-6 hover:shadow-sm transition bg-white"
              >
                <div className="h-14 w-14 rounded-2xl bg-violet-100 mb-4" />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-16 bg-[#17122B] text-white">
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
              className="px-5 py-3 rounded-xl bg-white text-violet-700 font-semibold hover:bg-violet-50 transition"
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
