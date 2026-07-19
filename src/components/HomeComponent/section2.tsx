"use client";

import React from "react";  
import { motion } from "framer-motion";

const logos = [
  { name: "IBM", content: <span className="font-bold text-3xl tracking-tighter">IBM<span className="text-blue-600">.</span></span> },
  { name: "Google", content: <span className="font-medium text-3xl text-gray-600">Google</span> },
  { name: "Coursera", content: <span className="font-semibold text-3xl text-[#0056D2]">coursera</span> },
];

// نكرر المصفوفة لضمان استمرارية الحركة بدون فراغات
const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

export default function TrustedBy() {
  return (
    <div className="w-full bg-white py-10 overflow-hidden border-y border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center">
        
        {/* كلمة Trusted By الثابتة على اليسار (اختياري حسب التصميم) */}
        <div className="px-8 z-10 bg-white shadow-[10px_0_15px_rgba(255,255,255,0.9)]">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Trusted by</span>
        </div>

        {/* حاوية الحركة */}
        <motion.div
          className="flex items-center gap-16"
          animate={{
            x: ["0%", "-50%"], // يتحرك بمقدار نصف المحتوى المكرر
          }}
          transition={{
            duration: 20, // السرعة (كل ما زاد الرقم صارت أبطأ وأنعم)
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div key={index} className="flex items-center gap-16">
              {/* الشعار */}
              <div className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer">
                {logo.content}
              </div>
              
              {/* الفاصل العمودي */}
              <div className="h-10 w-[1px] bg-gray-200"></div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}