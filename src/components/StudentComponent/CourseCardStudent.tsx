import { Check, Loader, Lock } from "lucide-react";

interface CourseCardProps {
  title: string;
  progress: number;
  status: "completed" | "in-progress" | "enrolled";
  language?: string;
  level?: string;
}

export default function CourseCard({
  title,
  progress,
  status,
  language = "Programming",
  level = "Beginner",
}: CourseCardProps) {
  const getStatusStyles = () => {
    if (status === "completed") {
      return {
        badgeBg: "bg-emerald-100/70",
        badgeText: "text-emerald-700",
        badgeIconColor: "text-emerald-600",
        progressBar: "bg-emerald-500",
        progressGlow: "shadow-emerald-500/40",
        percentageColor: "text-emerald-700",
      };
    }
    if (status === "in-progress") {
      return {
        badgeBg: "bg-amber-100/70",
        badgeText: "text-amber-700",
        badgeIconColor: "text-amber-600",
        progressBar: "bg-gradient-to-r from-amber-500 to-orange-500",
        progressGlow: "shadow-amber-500/40",
        percentageColor: "text-amber-700",
      };
    }
    return {
      badgeBg: "bg-zinc-100/70",
      badgeText: "text-zinc-700",
      badgeIconColor: "text-zinc-600",
      progressBar: "bg-zinc-400",
      progressGlow: "",
      percentageColor: "text-zinc-600",
    };
  };

  const getStatusIcon = () => {
    if (status === "completed")
      return <Check className="w-4 h-4" strokeWidth={3} />;
    if (status === "in-progress")
      return <Loader className="w-4 h-4 animate-spin" />;
    return <Lock className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (status === "completed") return "COMPLETED";
    if (status === "in-progress") return "IN PROGRESS";
    return "ENROLLED";
  };

  const styles = getStatusStyles();

  return (
    <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-xl shadow-black/10 border border-white/50 p-6 hover:shadow-2xl hover:border-white/70 transition-all duration-300 group cursor-pointer">
      {/* Status Badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl ${styles.badgeBg} ${styles.badgeText} border border-white/60 mb-5`}
      >
        <span className={styles.badgeIconColor}>
          {getStatusIcon()}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest">
          {getStatusText()}
        </span>
      </div>

      {/* Course Title */}
      <h3 className="text-gray-900 text-xl font-semibold leading-tight mb-6 min-h-[3.2rem]">
        {title}
      </h3>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="w-full bg-white/50 backdrop-blur-sm h-2 rounded-2xl overflow-hidden border border-white/40">
          <div
            className={`${styles.progressBar} ${styles.progressGlow} h-full rounded-2xl transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-gray-600 text-sm">
            {language}
          </span>
          <span className="text-gray-400 text-sm mx-1">·</span>
          <span className="text-gray-600 text-sm">
            {level}
          </span>
        </div>

        <span className={`text-lg font-bold ${styles.percentageColor}`}>
          {progress}%
        </span>
      </div>
    </div>
  );
}