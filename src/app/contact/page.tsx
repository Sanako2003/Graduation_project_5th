"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">
            Contact Us
          </h1>
          <p className="text-gray-500 mt-3">
            Have a question or want to get in touch? love to hear from you.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-gray-900">📍 Address</h3>
              <p className="text-gray-500 mt-2">syrai</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-gray-900">📧 Email</h3>
              <p className="text-gray-500 mt-2">contact@example.com</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-gray-900">📞 Phone</h3>
              <p className="text-gray-500 mt-2">+44 123 456 789</p>
            </div>

          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="p-10 rounded-2xl border border-gray-200 shadow-lg bg-[rgba(161,63,255,0.05)]">

            <form className="space-y-6">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[rgb(161,63,255)]"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[rgb(161,63,255)]"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-sm text-gray-700">Message</label>
                <textarea
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[rgb(161,63,255)]"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-semibold bg-[rgb(161,63,255)] hover:bg-[rgb(140,50,230)] transition"
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