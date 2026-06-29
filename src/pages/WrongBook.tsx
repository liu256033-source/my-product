import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../types';
import { TYPE_LABELS } from '../types';
import { useProgress } from '../hooks/useProgress';
import QuestionCard from '../components/QuestionCard';

interface WrongBookProps {
  questions: Question[];
}

export default function WrongBook({ questions }: WrongBookProps) {
  const { getWrongIds, markAnswer, getEntry } = useProgress();

  const allIds = useMemo(() => questions.map(q => q.id), [questions]);
  const wrongIds = useMemo(() => getWrongIds(allIds), [allIds, getWrongIds]);

  const wrongQuestions = useMemo(() => {
    const qMap = new Map(questions.map(q => [q.id, q]));
    return wrongIds.map(id => qMap.get(id)!).filter(Boolean);
  }, [questions, wrongIds]);

  const [selectedId, setSelectedId] = useState<string | null>(
    wrongQuestions[0]?.id ?? null
  );

  const selected = useMemo(
    () => wrongQuestions.find(q => q.id === selectedId),
    [wrongQuestions, selectedId]
  );

  const handleAnswer = (correct: boolean) => {
    if (selectedId) markAnswer(selectedId, correct);
    // Remove from wrong list display after re-do
    if (correct) {
      setSelectedId(prev => {
        const remaining = wrongIds.filter(id => id !== prev && id !== selectedId);
        // Find next wrong question
        const next = wrongQuestions.find(q => q.id !== prev && wrongIds.includes(q.id));
        return next?.id ?? remaining[0] ?? null;
      });
    }
  };

  if (wrongQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">错题本为空</h2>
        <p className="text-gray-500 mb-6">没有错题，继续保持！</p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 no-underline font-medium"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        错题本
        <span className="text-sm font-normal text-gray-500 ml-2">共 {wrongQuestions.length} 道</span>
      </h2>

      {/* Question list sidebar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {wrongQuestions.map(q => (
          <button
            key={q.id}
            onClick={() => setSelectedId(q.id)}
            className={`px-3 py-1 rounded-md text-sm transition-colors cursor-pointer
              ${q.id === selectedId
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {TYPE_LABELS[q.type]} {q.id.split('-')[1]}
          </button>
        ))}
      </div>

      {/* Selected question */}
      {selected && (
        <div>
          <QuestionCard
            question={selected}
            onAnswer={handleAnswer}
            savedResult={getEntry(selected.id)?.done ? { correct: getEntry(selected.id)!.correct } : null}
          />
          <div className="text-center mt-4">
            <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm no-underline">
              ← 返回首页
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
