"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Settings, User, Search, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const baseNavLinks = [
  { href: "/", label: "Home" },
  { href: "/Assessment", label: "Assessment" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact us" },
  { href: "/profile", label: "Profile" },
];

type UserData = {
  name: string;
  email: string;
  role?: string;
};

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // زائر (مش مسجل دخول) ما يشوف رابط Profile إطلاقاً
  const navLinks = user
    ? baseNavLinks
    : baseNavLinks.filter((link) => link.href !== "/profile");

  const handleLogout = async () => {
    // ... باقي الكود متل ما هو، بدون أي تغيير
    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // تجاهل أخطاء الشبكة وقت logout
    }
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/40 via-white to-purple-50/30 opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo + Nav Links */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors duration-200">
                Masar
              </span>
            </Link>

            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 text-[15px] font-medium text-slate-600 rounded-xl transition-all duration-200 hover:text-purple-600 hover:bg-purple-50/50 inline-block group"
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center rounded-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            {/* Search */}
            <div className="relative w-full max-w-xs hidden sm:block group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors duration-200 pointer-events-none">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full bg-slate-50 hover:bg-slate-50/80 pl-11 pr-4 py-2 rounded-full border border-slate-200/60 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-50 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="p-2.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all relative active:scale-95">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-white" />
              </button>
              <button className="p-2.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all active:scale-95">
                <Settings size={20} />
              </button>
            </div>

            <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />

            {/* Auth: إذا مسجل دخول → اسم + logout، إذا لأ → Login/Register */}
            {user ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 group bg-slate-50 hover:bg-slate-100 p-1.5 pr-3 rounded-full border border-slate-200/40 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <User size={16} />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="font-semibold text-slate-700 text-xs tracking-tight group-hover:text-purple-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider opacity-90 mt-0.5">
                      {user.role ?? "Student"}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-95"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 transition hover:bg-purple-50 hover:text-purple-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-purple-600 transition hover:bg-purple-700"
                >
                  Register
                </Link>
              </div>
            )}

            <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-slate-100 bg-white/95 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 whitespace-nowrap hover:text-purple-600 hover:border-purple-300 transition-all"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
