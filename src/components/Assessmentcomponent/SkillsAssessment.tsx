'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

interface KeywordTagProps {
  label: string;
}

const KeywordTag: React.FC<KeywordTagProps> = ({ label }) => (
  <div className="bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 px-4 py-2 rounded-full text-xs font-medium border border-slate-200/60 transition-colors cursor-default">
    {label}
  </div>
);

interface InfoCardProps {
  id: string;
  title: string;
  iconName: string;
  bgColor: string;
  textColor: string;
  isSelected: boolean;
  onSelect: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, iconName, bgColor, textColor, isSelected, onSelect }) => (
  <div 
    onClick={onSelect}
    className={`flex items-center justify-between p-4 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 border-2 ${
      isSelected 
        ? 'border-purple-600 bg-white ring-4 ring-purple-100 scale-[1.03] shadow-md' 
        : 'border-white/40 hover:border-slate-300 bg-opacity-90 hover:scale-[1.01]'
    } ${bgColor}`}
  >
    <span className={`text-base font-bold tracking-wide ${textColor}`}>{title}</span>
    <Icon icon={iconName} className={`w-8 h-8 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} />
  </div>
);

export default function SkillsAssessment() {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const keywords = [
    'Software Engineering', 'Cybersecurity', 'Product Management', 
    'Data Science', 'Artificial Intelligence', 'Cloud Computing', 
    'Network Systems', 'Technical Support', 'Game Development', 
    'Digital Design & UX', 'Mechatronics'
  ];

  const infoCards = [
    { id: 'game-development', title: 'Game Development', iconName: 'fluent-emoji:space-invader', bgColor: 'bg-[#eef2ff]', textColor: 'text-[#3b82f6]' },
    { id: 'ui-ux-design', title: 'UI/UX Design', iconName: 'fluent-emoji:artist-palette', bgColor: 'bg-[#e6f4ea]', textColor: 'text-[#10b981]' },
    { id: 'software-engineering', title: 'Software Engineering', iconName: 'fluent-emoji:technologist', bgColor: 'bg-[#fff7ed]', textColor: 'text-[#f97316]' },
    { id: 'artificial-intelligence', title: 'Artificial Intelligence', iconName: 'fluent-emoji:robot', bgColor: 'bg-[#fff1f2]', textColor: 'text-[#f43f5e]' }
  ];

  const handleStartExam = () => {
    if (!selectedField) return;
    router.push(`/Assessment/quiz?field=${selectedField}`);
  };

  return (
    <section id="assessment" className="w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-center">
        
        {/* القسم الأيسر: بطاقات الاختيار */}
        <div className="relative flex flex-col gap-5 p-8 bg-gradient-to-b from-slate-50/80 to-white/40 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 min-h-[420px] justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none" />
          
          {infoCards.map((card) => (
            <InfoCard 
              key={card.id} 
              {...card} 
              isSelected={selectedField === card.id}
              onSelect={() => setSelectedField(card.id)}
            />
          ))}
        </div>

        {/* القسم الأيمن: النصوص والتنبيه */}
        <div className="flex flex-col gap-6 text-left lg:pl-6">
          <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Masar Tech Aptitude <br />
              <span className="text-purple-600">Scale & Discovery</span>
            </h1>
            <Icon icon="fluent-emoji:light-bulb" className="w-14 h-14 animate-pulse flex-shrink-0 mt-2 sm:mt-0" />
          </div>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            This assessment helps you discover the perfect tech fields that align with your natural analytical abilities and personal interests.
          </p>

          {/* التنبيه المطلوب */}
          <div className={`transition-all duration-500 overflow-hidden ${selectedField ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              <Icon icon="fluent:info-16-filled" className="w-3 h-3" />
              Please select a domain first to start
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2 max-w-2xl">
            {keywords.map((keyword, index) => (
              <KeywordTag key={index} label={keyword} />
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartExam}
              disabled={!selectedField}
              className={`group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 ${
                selectedField 
                  ? 'shadow-[0_16px_36px_rgba(124,58,237,0.28)] hover:-translate-y-0.5 hover:from-purple-700 hover:to-indigo-700 hover:shadow-[0_20px_46px_rgba(124,58,237,0.36)] active:scale-[0.98] cursor-pointer'
                  : 'opacity-40 cursor-not-allowed shadow-none select-none contrast-75'
              }`}
            >
              {selectedField ? 'Start the Exam Now' : 'Please Select a Field First'}
              <span className="text-base transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}