'use client';

import React, { useRef, useState } from 'react';
import SkillsAssessment, { Question } from './SkillsAssessment';
import AssessmentResults from './AssessmentResults';
import { submitQuiz } from '@/lib/api';

interface Step {
  id: number;
  label: string;
}

type Phase = 'selection' | 'quiz' | 'submitting' | 'results';

export interface Recommendation {
  rank: number;
  course_title: string;
  score: number;
}

export default function QuizComponent() {
  const steps: Step[] = [
    { id: 1, label: 'Stage 1' },
    { id: 2, label: 'Stage 2' },
    { id: 3, label: 'Stage 3' },
    { id: 4, label: 'Stage 4' },
    { id: 5, label: 'Stage 5' },
  ];

  const [phase, setPhase] = useState<Phase>('selection');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [quizError, setQuizError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // قفل فوري لمنع تسجيل أكثر من ضغطة قبل تحديث الواجهة.
  const actionLock = useRef(false);

  const handleQuizReady = (
    qs: Question[],
    title: string,
    aid: number,
  ) => {
    setSubmitError('');
    setQuizError('');

    if (!Array.isArray(qs) || qs.length === 0) {
      setQuizError('لم تصل أسئلة للاختبار. حاولي توليد الاختبار مرة أخرى.');
      setPhase('selection');
      return;
    }

    const hasInvalidQuestions = qs.some(
      (question) =>
        !question ||
        question.question_id == null ||
        typeof question.question_text !== 'string' ||
        !question.question_text.trim() ||
        !Array.isArray(question.options) ||
        question.options.length === 0 ||
        question.options.some(
          (option) =>
            !option ||
            option.option_id == null ||
            typeof option.option_text !== 'string',
        ),
    );

    if (hasInvalidQuestions) {
      setQuizError(
        'وصلت بيانات أسئلة غير مكتملة. حاولي توليد الاختبار مرة أخرى.',
      );
      setPhase('selection');
      return;
    }

    if (!Number.isInteger(aid) || aid <= 0) {
      setQuizError(
        'لم يصل معرّف صالح لمحاولة الاختبار. حاولي مرة أخرى.',
      );
      setPhase('selection');
      return;
    }

    actionLock.current = false;
    setIsTransitioning(false);
    setQuestions(qs);
    setQuizTitle(title);
    setAttemptId(aid);
    setCurrentIndex(0);
    setAnswers({});
    setRecommendations([]);
    setPhase('quiz');
  };

  const handleSubmit = async (
    finalAnswers: Record<number, number>,
  ) => {
    if (attemptId === null) {
      setSubmitError('معرّف محاولة الاختبار غير موجود. أعيدي بدء الاختبار.');
      return;
    }

    setPhase('submitting');
    setSubmitError('');

    try {
      const answersPayload = Object.entries(finalAnswers).map(
        ([questionId, optionId]) => ({
          question_id: Number(questionId),
          selected_option_id: optionId,
        }),
      );

      const result = await submitQuiz(attemptId, answersPayload);

      setRecommendations(result.recommendations ?? []);
      setPhase('results');
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'حدث خطأ غير متوقع أثناء إرسال الإجابات.',
      );
      setPhase('quiz');
    }
  };

  const handleSelectOption = async (optionId: number) => {
    if (actionLock.current || phase !== 'quiz') return;

    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) return;

    actionLock.current = true;
    setIsTransitioning(true);
    setSubmitError('');

    const answeredIndex = currentIndex;

    const newAnswers = {
      ...answers,
      [currentQuestion.question_id]: optionId,
    };

    setAnswers(newAnswers);

    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 300);
      });

      if (answeredIndex < questions.length - 1) {
        setCurrentIndex(answeredIndex + 1);
      } else {
        await handleSubmit(newAnswers);
      }
    } finally {
      actionLock.current = false;
      setIsTransitioning(false);
    }
  };

  const handlePrevious = () => {
    if (actionLock.current || phase !== 'quiz') return;

    setSubmitError('');
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    actionLock.current = false;
    setIsTransitioning(false);
    setPhase('selection');
    setQuestions([]);
    setQuizTitle('');
    setAnswers({});
    setCurrentIndex(0);
    setAttemptId(null);
    setRecommendations([]);
    setSubmitError('');
    setQuizError('');
  };

  // ---- SELECTION ----
  if (phase === 'selection') {
    return (
      <div className="w-full">
        {quizError && (
          <div
            role="alert"
            className="max-w-3xl mx-auto mt-6 mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center"
          >
            {quizError}
          </div>
        )}

        <SkillsAssessment onQuizReady={handleQuizReady} />
      </div>
    );
  }

  // ---- SUBMITTING ----
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-[#F7F5FF] flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-purple-400 border-t-transparent mx-auto block" />
          <p className="text-slate-600 font-medium">
            Analyzing your answers...
          </p>
          <p className="text-slate-400 text-sm">
            Finding the best courses for you
          </p>
        </div>
      </div>
    );
  }

  // ---- RESULTS ----
  if (phase === 'results') {
    return (
      <AssessmentResults
        recommendations={recommendations}
        onRetake={handleRestart}
      />
    );
  }

  // ---- QUIZ ----
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // منع الوصول إلى خصائص سؤال غير موجود.
  if (!currentQuestion || totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-[#F7F5FF] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E4DDF5] p-8 text-center shadow-sm">
          <p role="alert" className="text-red-600 mb-6">
            تعذّر عرض السؤال الحالي. يرجى إعادة بدء الاختبار.
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="rounded-xl bg-[#2B368A] px-6 py-3 text-white font-semibold"
          >
            Restart Assessment
          </button>
        </div>
      </div>
    );
  }

  const activeStepId = Math.min(
    steps.length,
    Math.max(
      1,
      Math.ceil(((currentIndex + 1) / totalQuestions) * steps.length),
    ),
  );

  const difficultyLevel =
    currentQuestion.difficulty_level || 'Unknown';

  const difficultyClass =
    difficultyLevel === 'Beginner'
      ? 'bg-green-100 text-green-700'
      : difficultyLevel === 'Intermediate'
        ? 'bg-yellow-100 text-yellow-700'
        : difficultyLevel === 'Advanced'
          ? 'bg-red-100 text-red-700'
          : 'bg-slate-100 text-slate-700';

  return (
    <div className="min-h-screen bg-[#F7F5FF] p-4 md:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-5xl bg-white rounded-3xl p-6 md:p-12 shadow-[0_18px_50px_rgba(124,58,237,0.08)] relative overflow-hidden border border-[#E4DDF5]">
        {/* Stepper */}
        <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-12 relative px-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step.id === activeStepId
                      ? 'bg-[#2B368A] text-white shadow-lg shadow-indigo-900/20 scale-105'
                      : 'bg-white text-[#8A94A6] border border-[#E4DDF5]'
                  }`}
                >
                  {step.id}
                </div>

                <span
                  className={`mt-2 text-xs md:text-sm font-medium transition-colors ${
                    step.id === activeStepId
                      ? 'text-[#1E293B] font-bold'
                      : 'text-[#8A94A6]'
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
          ))}
        </div>

        {/* Title */}
        {quizTitle && (
          <p className="text-center text-xs font-bold text-purple-600 uppercase tracking-widest mb-4">
            {quizTitle}
          </p>
        )}

        {/* Counter */}
        <div className="text-center mb-6">
          <span className="text-[#5B50A1] text-sm font-bold tracking-widest bg-[#EEEBFC] px-4 py-1.5 rounded-full">
            {String(currentIndex + 1).padStart(2, '0')} /{' '}
            {String(totalQuestions).padStart(2, '0')}
          </span>
        </div>

        {/* Difficulty badge */}
        <div className="text-center mb-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyClass}`}
          >
            {difficultyLevel}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-6 md:p-8 text-center border border-[#E4DDF5] shadow-[0_4px_20px_rgba(124,58,237,0.05)] max-w-3xl mx-auto mb-8">
          <h2 className="text-[#2B368A] text-lg md:text-xl font-bold leading-relaxed max-w-2xl mx-auto">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div
            role="alert"
            className="max-w-3xl mx-auto mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center"
          >
            {submitError}
            <p className="mt-2">
              يمكنك الضغط على إجابتك مجددًا لإعادة المحاولة.
            </p>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {currentQuestion.options.map((option) => {
            const isSelected =
              answers[currentQuestion.question_id] === option.option_id;

            return (
              <button
                type="button"
                key={option.option_id}
                disabled={isTransitioning}
                aria-pressed={isSelected}
                onClick={() => handleSelectOption(option.option_id)}
                className={`group relative flex items-start text-left p-5 rounded-2xl border transition-all duration-300 outline-none disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-[#DCE7F9] border-[#A3BFFA] scale-[1.01] shadow-[0_6px_20px_rgba(59,130,246,0.1)]'
                    : 'bg-white border-[#E4DDF5] hover:border-violet-300 hover:shadow-[0_4px_15px_rgba(124,58,237,0.08)] active:scale-[0.99]'
                }`}
              >
                <span className="text-[#1E293B] font-bold text-sm md:text-base mr-3 mt-0.5 min-w-[18px]">
                  {option.option_key}.
                </span>

                <p className="text-[#475569] text-xs md:text-sm leading-relaxed">
                  {option.option_text}
                </p>
              </button>
            );
          })}
        </div>

        {/* Previous */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isTransitioning}
            className="inline-flex items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous Question
          </button>
        </div>
      </div>
    </div>
  );
}