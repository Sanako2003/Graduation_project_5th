'use client';

import React, { useState } from 'react';
import SkillsAssessment, { Question } from './SkillsAssessment';
import AssessmentResults from './AssessmentResults';
import { generateQuiz, submitQuiz } from '@/lib/api';

interface Step { id: number; label: string }

type Phase = 'selection' | 'quiz' | 'submitting' | 'results';

export interface Recommendation {
  rank: number;
  course_title: string;
  score: number;
}

export default function QuizComponent() {
  const steps: Step[] = [
    { id: 1, label: 'Interests' },
    { id: 2, label: 'Skills' },
    { id: 3, label: 'Capabilities' },
    { id: 4, label: 'Values' },
    { id: 5, label: 'Personality' },
  ];

  const [phase, setPhase]                       = useState<Phase>('selection');
  const [questions, setQuestions]               = useState<Question[]>([]);
  const [quizTitle, setQuizTitle]               = useState('');
  const [attemptId, setAttemptId]               = useState<number | null>(null);
  const [currentIndex, setCurrentIndex]         = useState(0);
  const [answers, setAnswers]                   = useState<Record<number, number>>({}); // question_id -> option_id
  const [recommendations, setRecommendations]   = useState<Recommendation[]>([]);
  const [submitError, setSubmitError]           = useState('');

  const handleQuizReady = (qs: Question[], title: string, aid: number) => {
    setQuestions(qs);
    setQuizTitle(title);
    setAttemptId(aid);
    setCurrentIndex(0);
    setAnswers({});
    setPhase('quiz');
  };

  const handleSelectOption = async (optionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    const currentQuestion = questions[currentIndex];

    // حفظ الإجابة: question_id -> option_id
    const newAnswers = {
      ...answers,
      [currentQuestion.question_id]: optionId,
    };
    setAnswers(newAnswers);

    await new Promise(r => setTimeout(r, 300));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // آخر سؤال — ابعت الأجوبة
      await handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: Record<number, number>) => {
    if (!attemptId) return;
    setPhase('submitting');
    setSubmitError('');

    try {
      const answersPayload = Object.entries(finalAnswers).map(([qId, oId]) => ({
        question_id: parseInt(qId),
        selected_option_id: oId,
      }));

      const result = await submitQuiz(attemptId, answersPayload);
      setRecommendations(result.recommendations ?? []);
      setPhase('results');
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'حدث خطأ غير متوقع');
      setPhase('quiz');
    }
  };

  const handleRestart = () => {
    setPhase('selection');
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setAttemptId(null);
    setRecommendations([]);
    setSubmitError('');
  };

  // ---- SELECTION ----
  if (phase === 'selection') {
    return <SkillsAssessment onQuizReady={handleQuizReady} />;
  }

  // ---- SUBMITTING ----
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-purple-400 border-t-transparent mx-auto block" />
          <p className="text-slate-600 font-medium">Analyzing your answers...</p>
          <p className="text-slate-400 text-sm">Finding the best courses for you</p>
        </div>
      </div>
    );
  }

  // ---- RESULTS ----
  if (phase === 'results') {
    return <AssessmentResults recommendations={recommendations} onRetake={handleRestart} />;
  }

  // ---- QUIZ ----
  const currentQuestion = questions[currentIndex];
  const totalQuestions  = questions.length;
  const activeStepId    = Math.ceil(((currentIndex + 1) / totalQuestions) * steps.length);

  return (
    <div className="min-h-screen bg-[#F4F5F9] p-4 md:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-5xl bg-[#F8F9FC] rounded-3xl p-6 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden border border-gray-100/50">

        {/* Stepper */}
        <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-12 relative px-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step.id === activeStepId
                    ? 'bg-[#2B368A] text-white shadow-lg shadow-indigo-900/20 scale-105'
                    : 'bg-white text-[#8A94A6] border border-gray-200'
                }`}>
                  {step.id}
                </div>
                <span className={`mt-2 text-xs md:text-sm font-medium transition-colors ${step.id === activeStepId ? 'text-[#1E293B] font-bold' : 'text-[#8A94A6]'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute h-[2px] bg-[#E2E8F0] z-0"
                  style={{ left: `${index * 25 + 12.5}%`, width: '25%', top: '20px' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Title */}
        {quizTitle && (
          <p className="text-center text-xs font-bold text-purple-600 uppercase tracking-widest mb-4">{quizTitle}</p>
        )}

        {/* Counter */}
        <div className="text-center mb-6">
          <span className="text-[#5B50A1] text-sm font-bold tracking-widest bg-[#EEEBFC] px-4 py-1.5 rounded-full">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
          </span>
        </div>

        {/* Difficulty badge */}
        <div className="text-center mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            currentQuestion.difficulty_level === 'Beginner'     ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                                   'bg-red-100 text-red-700'
          }`}>
            {currentQuestion.difficulty_level}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-6 md:p-8 text-center border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] max-w-3xl mx-auto mb-8">
          <h2 className="text-[#2B368A] text-lg md:text-xl font-bold leading-relaxed max-w-2xl mx-auto">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="max-w-3xl mx-auto mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {submitError}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.question_id] === option.option_id;
            return (
              <button
                key={option.option_id}
                onClick={() => handleSelectOption(option.option_id, option.option_key)}
                className={`group relative flex items-start text-left p-5 rounded-2xl border transition-all duration-300 outline-none ${
                  isSelected
                    ? 'bg-[#DCE7F9] border-[#A3BFFA] scale-[1.01] shadow-[0_6px_20px_rgba(59,130,246,0.1)]'
                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.02)] active:scale-[0.99]'
                }`}
              >
                <span className="text-[#1E293B] font-bold text-sm md:text-base mr-3 mt-0.5 min-w-[18px]">{option.option_key}.</span>
                <p className="text-[#475569] text-xs md:text-sm leading-relaxed">{option.option_text}</p>
              </button>
            );
          })}
        </div>

        {/* Previous */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous Question
          </button>
        </div>
      </div>
    </div>
  );
}