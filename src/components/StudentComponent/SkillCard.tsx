import { Brain } from "lucide-react";

type Skill = {
  name: string;
  percentage: number;
  color?: string; // purple, cyan, pink, amber, etc.
};

type SkillsCardProps = {
  skills: Skill[];
};

export default function SkillsCard({ skills }: SkillsCardProps) {
  const getColorClasses = (color: string = "purple") => {
    const colors: Record<string, { bar: string; text: string; glow: string }> = {
      purple: { bar: "bg-purple-500", text: "text-purple-600", glow: "shadow-purple-500/50" },
      cyan:   { bar: "bg-cyan-500",   text: "text-cyan-600",   glow: "shadow-cyan-500/50" },
      pink:   { bar: "bg-pink-500",   text: "text-pink-600",   glow: "shadow-pink-500/50" },
      amber:  { bar: "bg-amber-500",  text: "text-amber-600",  glow: "shadow-amber-500/50" },
      blue:   { bar: "bg-blue-500",   text: "text-blue-600",   glow: "shadow-blue-500/50" },
      emerald:{ bar: "bg-emerald-500",text: "text-emerald-600",glow: "shadow-emerald-500/50" },
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-xl shadow-black/10 border border-white/50 p-8 relative overflow-hidden">
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-cyan-50/30 to-transparent pointer-events-none rounded-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-gray-700 text-sm font-semibold uppercase tracking-widest">
          SKILLS & PROFICIENCY
        </h3>
        <div className="flex items-center gap-2 px-4 py-1 bg-white/70 backdrop-blur-md rounded-full text-xs font-medium text-purple-700">
          <Brain className="w-4 h-4" />
          AI ADVISED
        </div>
      </div>

      {/* Skills List with Progress Bars */}
      <div className="space-y-7">
        {skills.map((skill, index) => {
          const colorClasses = getColorClasses(skill.color);
          return (
            <div key={index} className="space-y-3">
              {/* Skill Name + Percentage */}
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium text-[15px]">
                  {skill.name}
                </span>
                <span className={`font-bold text-base ${colorClasses.text}`}>
                  {skill.percentage}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-2.5 bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/70">
                <div
                  className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-700 ease-out ${colorClasses.bar} ${colorClasses.glow}`}
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}