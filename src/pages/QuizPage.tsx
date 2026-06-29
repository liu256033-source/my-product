import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { Question } from '../types';
import { TYPE_LABELS } from '../types';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import ModeSelector from '../components/ModeSelector';
import { useProgress } from '../hooks/useProgress';

interface QuizPageProps {
  questions: Question[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage({ questions }: QuizPageProps) {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'random' ? 'random' : 'sequential';

  const [mode, setMode] = useState<'sequential' | 'random'>(initialMode);
  const [index, setIndex] = useState(0);
  const { markAnswer, getStats, getEntry } = useProgress();

  const filtered = useMemo(() => {
    return questions.filter(q => q.type === type);
  }, [questions, type]);

  const shuffled = useMemo(() => {
    return mode === 'random' ? shuffle(filtered) : filtered;
  }, [filtered, mode]);

  const stats = useMemo(() => {
    const ids = filtered.map(q => q.id);
    return getStats(ids);
  }, [filtered, getStats]);

  const current = shuffled[index];
  const isFirst = index === 0;
  const isLast = index === shuffled.length - 1;

  const handleAnswer = (correct: boolean) => {
    if (!current) return;
    markAnswer(current.id, correct);
  };

  const goNext = () => {
    if (!isLast) setIndex(i => i + 1);
  };
  const goPrev = () => {
    if (!isFirst) setIndex(i => i - 1);
  };

  const handleModeChange = (newMode: 'sequential' | 'random') => {
    setMode(newMode);
    setIndex(0);
  };

  if (!current) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">该题型暂无题目</p>
      </div>
    );
  }

  const label = TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-800">{label}</h2>
        <ModeSelector mode={mode} onChange={handleModeChange} />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar done={stats.done} total={stats.total} correct={stats.correct} />
      </div>

      {/* Question indicator */}
      <div className="text-sm text-gray-500 mb-4 text-center">
        第 {index + 1} / {shuffled.length} 题
      </div>

      {/* Question */}
      <QuestionCard
        question={current}
        onAnswer={handleAnswer}
        savedResult={getEntry(current.id)?.done ? { correct: getEntry(current.id)!.correct } : null}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
        >
          上一题
        </button>
        <button
          onClick={goNext}
          disabled={isLast}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
        >
          下一题
        </button>
      </div>
    </div>
  );
}
