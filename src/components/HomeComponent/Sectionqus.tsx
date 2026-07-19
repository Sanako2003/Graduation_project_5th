"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, Terminal, Cpu, BarChart3, ArrowRight } from "lucide-react";

export default function TechAssessmentHero(): React.JSX.Element {
  // حالة لمحاكاة التفاعل السريع عند تحويم الفأرة
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // إعداد حركة ثلاثية الأبعاد تفاعلية بناءً على حركة الماوس (Parallax Effect)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { currentTarget, clientX, clientY } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // حساب موقع الفأرة بالنسبة لمركز العنصر
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }

  // ربط حركة الماوس بزوايا الدوران (Rotation) لإنشاء تأثير 3D احترافي للكونسول
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-16 sm:px-8 lg:px-16 flex items-center justify-center">
      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative w-full max-w-6xl min-h-[440px] md:min-h-[400px] overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-white/95 via-slate-50/90 to-purple-50/80 p-8 shadow-[0_30px_95px_rgba(99,102,241,0.18)] backdrop-blur-sm md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-60 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 md:left-[75%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-to-br from-purple-200/55 via-indigo-200/35 to-cyan-200/25 rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 group-hover:from-purple-200/70 group-hover:to-cyan-200/35" />

        <div className="flex-1 space-y-6 text-center md:text-left z-10 flex flex-col items-center md:items-start order-2 md:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-purple-700 font-mono">
              AI-Powered Evaluation
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight max-w-xl">
            MASAR Tech <br />
            <span className="bg-gradient-to-r bg-purple-600 bg-clip-text text-transparent">
              Aptitude Indicator
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed font-normal">
            Decode your engineering DNA. Discover the absolute ideal path for your skill set among top-tier tech domains and ongoing market demands.
          </p>

          <div className="pt-2 w-full sm:w-auto">
            <button 
              type="button"
              className="group/btn relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-purple-600 px-8 py-4 text-sm font-bold text-white shadow-[0_16px_35px_rgba(124,58,237,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-[0_20px_45px_rgba(124,58,237,0.36)] sm:w-auto active:scale-[0.98]"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center z-10 order-1 md:order-2 perspective-[1000px]">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            animate={{ y: isHovered ? -10 : [0, -10, 0] }}
            transition={isHovered ? { type: "spring", stiffness: 300, damping: 20 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex w-full max-w-[340px] aspect-[1.1] flex-col justify-between rounded-[24px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_26px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-600" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-slate-700">assessment_core.sh</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="flex-grow flex flex-col justify-center gap-3.5 py-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-purple-100 bg-purple-50 p-1.5 text-purple-600">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">System Aptitude</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-700">94.2%</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-1.5 text-cyan-600">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Market Alignment</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-700">Optimal</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Vectoring Potential...</span>
                <span>Ready</span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden bg-slate-200">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-1/3 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" 
                />
              </div>
            </div>

            <div className="absolute -inset-px rounded-[24px] bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 opacity-0 blur-sm transition-opacity duration-500 pointer-events-none group-hover:opacity-20" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}