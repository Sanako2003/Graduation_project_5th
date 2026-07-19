// components/Navbar.tsx
import Link from "next/link";
import { Bell, Settings, User, Search, Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/Assessment", label: "Assessment" },         
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact us" },
  { href: "/profile", label: "Profile" },
];
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      
      {/* ------------------ خلفية هندسية نقية ومحدودة الشفافية (Minimal Dot Grid) ------------------ */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* هالة بنفسجية ناعمة جداً في الخلفية للعمق البصري */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/40 via-white to-purple-50/30 opacity-70" />
        {/* شبكة نقاط ميكروسكوبية خافتة لا تؤثر على وضوح النصوص */}
        <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]" />
      </div>

      {/* ---------------------------------------------------------------------------- */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* 1. الشعار والهوية البصرية (Brand Logo) */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors duration-200">
                Masar
              </span>
            </Link>

            {/* 2. روابط القائمة الرئيسية (Desktop Navigation) */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="relative px-4 py-2 text-[15px] font-medium text-slate-600 rounded-xl transition-all duration-200 hover:text-purple-600 hover:bg-purple-50/50 inline-block group"
                  >
                    {link.label}
                    {/* خط تفاعلي مغناطيسي رفيع أسفل الرابط الحالي */}
                    <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center rounded-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. أدوات التحكم والبحث والملف الشخصي (Control Hub) */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            
            {/* كبسولة البحث المستقرة بنيوياً دون تمدد حركي يزعج العناصر المجاورة */}
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

            {/* أزرار الإشعارات والإعدادات النقية */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="p-2.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all relative active:scale-95">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-white"></span>
              </button>

              <button className="p-2.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all active:scale-95">
                <Settings size={20} />
              </button>
            </div>

            {/* فاصل عمودي ناعم عالي النقاء */}
            <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1 flex-shrink-0"></div>

            {/* كبسولة ملف المستخدم الشخصي - محايدة وراقية */}
            <Link href="/profile" className="flex items-center gap-3 group flex-shrink-0 bg-slate-50 hover:bg-slate-100 p-1.5 pr-3 rounded-full border border-slate-200/40 transition-all duration-200">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <User size={16} />
              </div>
              <div className="hidden lg:block text-left">
                <p className="font-semibold text-slate-700 text-xs tracking-tight group-hover:text-purple-600 transition-colors">Ahmed Khalid</p>
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider opacity-90 mt-0.5">Premium</p>
              </div>
            </Link>

            {/* زر القائمة للشاشات الصغيرة جداً بدلاً من تكديس الأزرار */}
            <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
              <Menu size={22} />
            </button>
          </div>

        </div>
      </div>

      {/* 4. قائمة الموبايل الأفقية المنظمة (تظهر فقط على شاشات المحمول دون تدمير التصميم) */}
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