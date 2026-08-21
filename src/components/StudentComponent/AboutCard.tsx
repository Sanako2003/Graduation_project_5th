import { Calendar, Layers, Clock, MapPin, Github } from "lucide-react";

type AboutCardProps = {
  age: number;
  educationLevel: string;
  studyHours: number;
  location: string;
  github?: string;
  interests: string[];
};

export default function AboutCard({
  age,
  educationLevel,
  studyHours,
  location,
  github,
  interests,
}: AboutCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-violet-100/50 border border-[#E4DDF5] p-8 relative overflow-hidden">
      {/* Optional subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-teal-50/30 pointer-events-none rounded-3xl" />

      {/* ABOUT Header */}
      <h3 className="text-slate-600/90 text-xs font-semibold uppercase tracking-[2px] mb-8">
        ABOUT
      </h3>

      {/* Info Rows */}
      <div className="space-y-6">
        {/* Age */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-slate-700 text-[15px] font-medium">Age</span>
          </div>
          <span className="text-[#172033] font-semibold">{age} years old</span>
        </div>

        {/* Education Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center backdrop-blur-sm">
              <Layers className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="text-slate-700 text-[15px] font-medium">Education level</span>
          </div>
          <span className="text-[#172033] font-semibold">{educationLevel}</span>
        </div>

        {/* Study Hours */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-100 flex items-center justify-center backdrop-blur-sm">
              <Clock className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-slate-700 text-[15px] font-medium">Email </span>
          </div>
          <span className="text-[#172033] font-semibold">{studyHours} </span>
        </div>

        {/* Location */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-gray-700 text-[15px] font-medium">Location</span>
          </div>
          <span className="text-gray-900 font-semibold">{location}</span>
        </div> */}

        {/* GitHub */}
        {github && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center backdrop-blur-sm">
                <Github className="w-5 h-5 text-zinc-700" />
              </div>
              <span className="text-slate-700 text-[15px] font-medium">GitHub</span>
            </div>
            <a
              href={`https://${github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:text-violet-700 font-medium text-[15px] hover:underline transition-colors"
            >
              {github}
            </a>
          </div>
        )}
      </div>

      {/* INTERESTS Section */}
      <div className="mt-10">
        <h4 className="text-slate-600/90 text-xs font-semibold uppercase tracking-[2px] mb-4">
          INTERESTS
        </h4>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="px-5 py-2 bg-violet-50 backdrop-blur-md border border-violet-100 text-slate-700 text-sm rounded-2xl shadow-sm hover:bg-violet-100 transition-all"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
