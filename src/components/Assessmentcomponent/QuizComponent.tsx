'use client';

import React, { useState } from 'react';
import AssessmentResults from './AssessmentResults';
interface Step {
  id: number;
  label: string;
}

interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  title: string;
  subTitle: string;
  description: string;
}

interface Question {
  id: number;
  stepId: number;
  titleKey: string;
  questionText: string;
  options: Option[];
}

export default function QuizComponent() {
  const steps: Step[] = [
    { id: 1, label: 'Interests' },
    { id: 2, label: 'Skills' },
    { id: 3, label: 'Capabilities' },
    { id: 4, label: 'Values' },
    { id: 5, label: 'Personality' },
  ];

  const questions: Question[] = [
    {
      id: 1,
      stepId: 1,
      titleKey: 'FIRST QUESTION',
      questionText: 'If you received an invitation from one of the major Saudi tech companies to help their internal departments for three days, which department would you choose?',
      options: [
        { id: 'A', title: 'GAME STUDIO', subTitle: 'Game Studio', description: 'Follow the collaboration of designers and developers to create a fun interactive experience from concept to ready-to-play game.' },
        { id: 'B', title: 'PRODUCT DEPARTMENT', subTitle: 'Product', description: 'See how they decide on features and prioritize based on user and market needs.' },
        { id: 'C', title: 'DATA DEPARTMENT', subTitle: 'Data', description: 'Follow how they analyze data and generate insights and trends that help management make more accurate decisions.' },
        { id: 'D', title: 'INFRASTRUCTURE DEPARTMENT', subTitle: 'Infrastructure', description: 'See how they build and run systems to serve millions of users stably and without interruption.' },
      ],
    },
    {
      id: 2,
      stepId: 1,
      titleKey: 'SECOND QUESTION',
      questionText: 'When working on a new project, what is the most critical factor you focus on initially?',
      options: [
        { id: 'A', title: 'USER INTERACTION', subTitle: 'UI/UX', description: 'Designing high-fidelity prototypes and mapping out user journeys to ensure maximum engagement.' },
        { id: 'B', title: 'BUSINESS LOGIC', subTitle: 'Strategy', description: 'Aligning product goals with market demands and planning the core feature roadmap.' },
        { id: 'C', title: 'METRICS & ANALYTICS', subTitle: 'Insights', description: 'Setting up tracking parameters to measure user behavior and database performance right from day one.' },
        { id: 'D', title: 'SCALABILITY', subTitle: 'Architecture', description: 'Choosing the right server infrastructure and database design to support heavy user traffic.' },
      ],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 300);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsFinished(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex((prev) => prev - 1);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] p-4 md:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-5xl bg-[#F8F9FC] rounded-3xl p-6 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden border border-gray-100/50">
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
          <div className="absolute top-4 left-4 w-12 h-12 bg-[#4338CA] rounded-xl transform rotate-12"></div>
          <div className="absolute top-10 left-12 w-16 h-16 bg-[#6366F1] rounded-xl opacity-60"></div>
        </div>

        <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-12 relative px-4">
          {steps.map((step, index) => {
            const isActive = currentQuestion ? currentQuestion.stepId === step.id : false;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isActive || (isFinished && step.id === 5)
                        ? 'bg-[#2B368A] text-white shadow-lg shadow-indigo-900/20 scale-105'
                        : 'bg-white text-[#8A94A6] border border-gray-200'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`mt-2 text-xs md:text-sm font-medium transition-colors ${
                      isActive ? 'text-[#1E293B] font-bold' : 'text-[#8A94A6]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className="absolute h-[2px] bg-[#E2E8F0] z-0"
                    style={{
                      left: `${index * 25 + 12.5}%`,
                      width: '25%',
                      top: '20px',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {isFinished ? (
          <div className="text-center py-14 md:py-16 max-w-2xl w-full mx-auto">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <h2 className="text-[#2B368A] text-2xl font-bold mb-2">Thank you!</h2>
            <p className="text-gray-600 mb-6">You have completed the assessment. Your answers have been recorded successfully.</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-[#2B368A] text-white font-medium rounded-xl hover:bg-[#1d2663] transition-colors"
            >
              Retake Assessment
            </button>
            <AssessmentResults />
          </div>
          
        ) : (
          <>
            <div className="text-center mb-6">
              <span className="text-[#5B50A1] text-sm font-bold tracking-widest bg-[#EEEBFC] px-4 py-1.5 rounded-full">
                {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] max-w-3xl mx-auto mb-8">
              <p className="text-[#8A94A6] text-xs font-bold tracking-wider uppercase mb-3">
                {currentQuestion.titleKey}
              </p>
              <h2 className="text-[#2B368A] text-lg md:text-xl font-bold leading-relaxed max-w-2xl mx-auto">
                {currentQuestion.questionText}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`group relative flex items-start text-left p-5 rounded-2xl border transition-all duration-300 outline-none ${
                      isSelected
                        ? 'bg-[#DCE7F9] border-[#A3BFFA] scale-[1.01] shadow-[0_6px_20px_rgba(59,130,246,0.1)]'
                        : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.02)] active:scale-[0.99]'
                    }`}
                  >
                    <span className="text-[#1E293B] font-bold text-sm md:text-base mr-3 mt-0.5 block min-w-[18px]">
                      {option.id}.
                    </span>

                    <div className="flex-1">
                      <p className="text-[#1E293B] font-bold text-xs md:text-sm tracking-wide uppercase mb-1">
                        {option.title} <span className="text-[#64748B] font-medium lowercase">({option.subTitle}):</span>
                      </p>
                      <p className="text-[#475569] text-xs md:text-sm leading-relaxed font-normal">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300 hover:text-purple-700 hover:shadow-[0_10px_25px_rgba(99,102,241,0.12)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:shadow-sm"
              >
                Previous Question
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}