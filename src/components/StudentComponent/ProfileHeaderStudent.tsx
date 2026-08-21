import Image from "next/image";
import { Bell } from "lucide-react";

type Student = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  track: string;
  enrolledCourses?: number;
  completedCourses?: number;
  completionRate?: number;
  studyHours?: number;
};

type ProfileHeaderProps = {
  student: Student;
};

export default function ProfileHeader({ student }: ProfileHeaderProps) {
  const nameParts = student.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-xl shadow-violet-500/10 border border-[#E4DDF5] p-7 relative overflow-hidden">
      {/* Soft background glow decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-teal-50 to-transparent opacity-60 pointer-events-none" />

      {/* Bell Icon */}
      <div className="absolute top-6 right-7 z-20">
        {/* <button
          type="button"
          aria-label="Notifications"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button> */}
      </div>

      <div className="flex items-start justify-between relative z-10">
        {/* Left Side - Profile Info */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 via-teal-400 to-fuchsia-400 p-[3.5px] shadow-md">
              {student.avatar ? (
                <Image
                  src={student.avatar}
                  alt={`${student.name} avatar`}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#2B2847] flex items-center justify-center">
                  <span className="text-white text-4xl font-bold tracking-tighter">
                    {firstName[0]}
                    {lastName[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-green-500 rounded-full border-[3.5px] border-white shadow-sm" />
          </div>

          {/* Name and Details */}
          <div className="pt-1">
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl font-semibold text-[#172033] tracking-tight">
                {firstName}
              </h1>
              <h1 className="text-4xl font-semibold text-cyan-500 tracking-tight">
                {lastName}
              </h1>
            </div>

            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-2.5 text-slate-700 text-[15px]">
                <span className="text-xl">🎓</span>
                <span className="font-medium">{student.track}</span>
              </p>

              <p className="flex items-center gap-2.5 text-slate-700 text-[15px]">
                <span className="text-xl">✉️</span>
                <span className="font-medium">{student.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Statistics */}
        <div className="flex items-center gap-12 pr-2">
          {/* Enrolled */}
          <div className="flex flex-col items-center text-center">
        
            <span className="text-3xl font-bold text-[#172033] mt-1">
              {student.enrolledCourses ?? 12}
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-widest mt-1">ENROLLED</span>
          </div>

          {/* Done */}
          <div className="flex flex-col items-center text-center">
         
            <span className="text-3xl font-bold text-[#172033] mt-1">
              {student.completedCourses ?? 7}
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-widest mt-1">DONE</span>
          </div>

          {/* Completion */}
          <div className="flex flex-col items-center text-center">
         
            <span className="text-3xl font-bold text-[#172033] mt-1">
              {student.completionRate ?? 94}%
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-widest mt-1">COMPLETION</span>
          </div>

          {/* Study Time */}
          <div className="flex flex-col items-center text-center">
          
            <span className="text-3xl font-bold text-[#172033] mt-1">
              {student.studyHours ?? 328}h
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-widest mt-1">STUDY TIME</span>
          </div>
        </div>
      </div>
    </div>
  );
}
