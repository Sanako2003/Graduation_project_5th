import { FileText } from 'lucide-react';

interface AssessmentCardProps {
  title: string;
  date: string;
  score: number;
  color?: 'purple' | 'orange' | 'green';
}

export default function AssessmentCard({ title, date, score, color = 'purple' }: AssessmentCardProps) {
  const getColorClasses = () => {
    if (color === 'purple') return { bg: 'bg-purple-100', text: 'text-purple-600' };
    if (color === 'orange') return { bg: 'bg-orange-100', text: 'text-orange-600' };
    return { bg: 'bg-green-100', text: 'text-green-600' };
  };
  
  const colors = getColorClasses();
  const strokeColor = color === 'purple' ? '#a855f7' : color === 'orange' ? '#f97316' : '#22c55e';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <FileText className={colors.text} size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>
      </div>
      
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
          <circle 
            cx="32" cy="32" r="28" 
            stroke={strokeColor}
            strokeWidth="6" fill="none"
            strokeDasharray={`${(score / 100) * 175.93} 175.93`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{score}%</span>
        </div>
      </div>
    </div>
  );
}