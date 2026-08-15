'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface CourseResult {
  rank: number; title: string; percentage: number;
  iconName: string; courseHref: string;
}

interface Props { onRetake: () => void }

export default function AssessmentResults({ onRetake }: Props) {
  const resultsData: CourseResult[] = [
    { rank: 1, title: 'Artificial Intelligence',        percentage: 42, iconName: 'fluent-emoji:brain',                 courseHref: '/courses/101' },
    { rank: 2, title: 'Cybersecurity',                  percentage: 41, iconName: 'fluent-emoji:shield',                courseHref: '/courses/102' },
    { rank: 3, title: 'Technical Support & Systems',    percentage: 41, iconName: 'fluent-emoji:wrench',                courseHref: '/courses/102' },
    { rank: 4, title: 'Technical Product Management',   percentage: 39, iconName: 'fluent-emoji:clipboard',             courseHref: '/courses/101' },
    { rank: 5, title: 'Networks & Cloud Computing',     percentage: 32, iconName: 'fluent-emoji:cloud',                 courseHref: '/courses/102' },
    { rank: 6, title: 'Software Engineering',           percentage: 30, iconName: 'fluent-emoji:building-construction', courseHref: '/courses/101' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Your Career Path</h1>
          <p className="text-slate-500">Based on your assessment, these are the best fields for you.</p>
        </div>

        <div className="space-y-4">
          {resultsData.map((course, index) => (
            <div key={course.rank}
              className={`group relative overflow-hidden bg-white rounded-3xl p-5 flex items-center gap-6 border transition-all duration-300 hover:shadow-xl hover:border-indigo-200 ${index === 0 ? 'border-indigo-500 shadow-indigo-100' : 'border-slate-100'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {course.rank}
              </div>
              <div className="flex items-center gap-4 flex-grow">
                <Icon icon={course.iconName} className="w-8 h-8" />
                <div>
                  <h3 className="font-bold text-slate-900">{course.title}</h3>
                  <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.percentage}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-black text-indigo-600 text-xl">{course.percentage}%</span>
                <a href={course.courseHref}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors">
                  View Course
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button onClick={onRetake}
            className="text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-2 mx-auto transition-colors">
            <Icon icon="lucide:refresh-ccw" />
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
