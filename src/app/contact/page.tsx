"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F5FF] py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#172033]">
            Contact Us
          </h1>
          <p className="text-slate-500 mt-3">
            Have a question or want to get in touch? love to hear from you.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            <div className="p-6 rounded-2xl border border-[#E4DDF5] bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-[#172033]">📍 Address</h3>
              <p className="text-slate-500 mt-2">syrai</p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E4DDF5] bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-[#172033]">📧 Email</h3>
              <p className="text-slate-500 mt-2">contact@example.com</p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E4DDF5] bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-[#172033]">📞 Phone</h3>
              <p className="text-slate-500 mt-2">+44 123 456 789</p>
            </div>

          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="p-10 rounded-2xl border border-[#E4DDF5] shadow-lg bg-white">

            <form className="space-y-6">

              {/* NAME */}
              <div>
                <label className="text-sm text-slate-700">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full mt-2 p-3 rounded-lg border border-[#E4DDF5] bg-[#F7F5FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full mt-2 p-3 rounded-lg border border-[#E4DDF5] bg-[#F7F5FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-sm text-slate-700">Message</label>
                <textarea
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full mt-2 p-3 rounded-lg border border-[#E4DDF5] bg-[#F7F5FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-semibold bg-violet-600 hover:bg-violet-700 transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </div>
    </main>
  );
}
