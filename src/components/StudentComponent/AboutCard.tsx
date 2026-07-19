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
    <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/10 border border-white/40 p-8 relative overflow-hidden">
      {/* Optional subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none rounded-3xl" />

      {/* ABOUT Header */}
      <h3 className="text-gray-600/90 text-xs font-semibold uppercase tracking-[2px] mb-8">
        ABOUT
      </h3>

      {/* Info Rows */}
      <div className="space-y-6">
        {/* Age */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-700 text-[15px] font-medium">Age</span>
          </div>
          <span className="text-gray-900 font-semibold">{age} years old</span>
        </div>

        {/* Education Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center backdrop-blur-sm">
              <Layers className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="text-gray-700 text-[15px] font-medium">Education level</span>
          </div>
          <span className="text-gray-900 font-semibold">{educationLevel}</span>
        </div>

        {/* Study Hours */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center backdrop-blur-sm">
              <Clock className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-gray-700 text-[15px] font-medium">Email </span>
          </div>
          <span className="text-gray-900 font-semibold">{studyHours} </span>
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
              <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center backdrop-blur-sm">
                <Github className="w-5 h-5 text-zinc-700" />
              </div>
              <span className="text-gray-700 text-[15px] font-medium">GitHub</span>
            </div>
            <a
              href={`https://${github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium text-[15px] hover:underline transition-colors"
            >
              {github}
            </a>
          </div>
        )}
      </div>

      {/* INTERESTS Section */}
      <div className="mt-10">
        <h4 className="text-gray-600/90 text-xs font-semibold uppercase tracking-[2px] mb-4">
          INTERESTS
        </h4>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="px-5 py-2 bg-white/60 backdrop-blur-md border border-white/50 text-gray-700 text-sm rounded-2xl shadow-sm hover:bg-white/80 transition-all"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}