import { Star } from 'lucide-react';

interface RecommendedCardProps {
  title: string;
  instructor: string;
  rating: number;
  students: number;
  image?: string;           // رابط صورة الأيقونة 3D
  colorFrom?: string;       // لون البداية للـ gradient
  colorTo?: string;         // لون النهاية
}

export default function RecommendedCard({
  title,
  instructor,
  rating,
  students,
  image = "",
  colorFrom = "from-blue-400",
  colorTo = "to-purple-500",
}: RecommendedCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-violet-100/50 border border-[#E4DDF5] overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
      
      {/* 3D Icon Area */}
      <div className={`h-52 flex items-center justify-center bg-gradient-to-br ${colorFrom} ${colorTo} relative overflow-hidden`}>
        <div className="relative z-10 scale-110 group-hover:scale-125 transition-transform duration-500">
          {image !== "" && (
              <img 
                src={image} 
                alt={title} 
                className="w-40 h-40 object-contain drop-shadow-2xl" 
              />
            )}
        </div>

        {/* Checkmark badge (مثل الصورة) */}
        <div className="absolute bottom-6 right-6 w-9 h-9 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <div className="w-6 h-6 bg-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl leading-none mt-0.5">✓</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="font-semibold text-lg text-[#172033] leading-tight mb-2 line-clamp-2">
          {title}
        </h4>
        
        <p className="text-slate-600 text-sm mb-5">
          {instructor}
        </p>

        {/* Rating & Students */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            <span className="font-semibold text-[#172033]">{rating}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm font-medium">
              {students.toLocaleString()}
            </span>
            
            {/* Overlapping Avatars */}
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 border-2 border-white shadow-sm"></div>
              <div className="w-7 h-7 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white shadow-sm"></div>
              <div className="w-7 h-7 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
