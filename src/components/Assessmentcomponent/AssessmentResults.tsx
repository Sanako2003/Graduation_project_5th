'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { Recommendation } from './QuizComponent';

interface Props {
  recommendations: Recommendation[];
  onRetake: () => void;
}

// أيقونات افتراضية بناءً على الكلمات المفتاحية بالعنوان
function getIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('python') || t.includes('data'))   return 'fluent-emoji:bar-chart';
  if (t.includes('machine') || t.includes('ai') || t.includes('deep')) return 'fluent-emoji:brain';
  if (t.includes('web') || t.includes('html') || t.includes('css'))    return 'fluent-emoji:globe-showing-americas';
  if (t.includes('security') || t.includes('cyber'))                    return 'fluent-emoji:shield';
  if (t.includes('cloud') || t.includes('network'))                     return 'fluent-emoji:cloud';
  if (t.includes('java') || t.includes('swift') || t.includes('kotlin'))return 'fluent-emoji:laptop';
  if (t.includes('product') || t.includes('management'))                return 'fluent-emoji:clipboard';
  if (t.includes('design') || t.includes('ux'))                         return 'fluent-emoji:artist-palette';
  return 'fluent-emoji:graduation-cap';
}

export default function AssessmentResults({ recommendations, onRetake }: Props) {
  // لو ما في recommendations، اعرض رسالة
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F5FF] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Icon icon="fluent-emoji:thinking-face" className="w-16 h-16 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">No recommendations found</h2>
          <p className="text-slate-500">Try retaking the assessment.</p>
          <button onClick={onRetake}
            className="mt-4 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5FF] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Your Career Path</h1>
          <p className="text-slate-500">Based on your assessment, these are the best courses for you.</p>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const scorePercent = Math.round(rec.score * 100);
            const icon = getIcon(rec.course_title);

            return (
              <div key={rec.rank}
                className={`group relative overflow-hidden bg-white rounded-3xl p-5 flex items-center gap-6 border transition-all duration-300 hover:shadow-xl hover:border-violet-200 ${
                  index === 0 ? 'border-violet-500 shadow-violet-100' : 'border-[#E4DDF5]'
                }`}
              >
                {/* Rank */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  index === 0 ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700'
                }`}>
                  {rec.rank}
                </div>

                {/* Icon + Title + Bar */}
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <Icon icon={icon} className="w-8 h-8 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{rec.course_title}</h3>
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all duration-700"
                        style={{ width: `${scorePercent}%` }} />
                    </div>
                  </div>
                </div>

                {/* Score + Button */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-black text-violet-600 text-xl">{scorePercent}%</span>
                  <a href={`/courses?q=${encodeURIComponent(rec.course_title)}`}
                    className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors whitespace-nowrap">
                    View Course
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button onClick={onRetake}
            className="text-slate-500 hover:text-violet-600 font-medium flex items-center gap-2 mx-auto transition-colors">
            <Icon icon="lucide:refresh-ccw" />
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
