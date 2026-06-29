import { useState } from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  savedResult?: { correct: boolean } | null;
}

export default function QuestionCard({ question, onAnswer, savedResult }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(!!savedResult);
  const [selfEval, setSelfEval] = useState<boolean | null>(
    savedResult ? savedResult.correct : null
  );

  const isChoice = question.type === 'choice';

  const handleOptionClick = (opt: string) => {
    if (revealed) return;
    const letter = opt.charAt(0);
    setSelected(letter);
    setRevealed(true);
    const correct = letter === question.answer;
    onAnswer(correct);
  };

  const handleSelfEval = (correct: boolean) => {
    if (revealed) return;
    setSelfEval(correct);
    setRevealed(true);
    onAnswer(correct);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      {/* Question text */}
      <div className="text-lg leading-relaxed mb-6 text-gray-800 whitespace-pre-wrap">
        {question.question}
      </div>

      {/* Choice options */}
      {isChoice && (
        <div className="space-y-3 mb-6">
          {question.options.map((opt, i) => {
            const letter = opt.charAt(0);
            let bg = 'bg-gray-50 hover:bg-gray-100 border-gray-200';
            if (revealed) {
              if (letter === question.answer) {
                bg = 'bg-green-50 border-green-400 text-green-800';
              } else if (letter === selected) {
                bg = 'bg-red-50 border-red-400 text-red-800';
              } else {
                bg = 'bg-gray-50 border-gray-100 text-gray-400';
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                disabled={revealed}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${bg}`}
              >
                <span className="font-semibold mr-2">{optionLabels[i]}.</span>
                {opt.replace(/^[A-D][\.\、\s]+/, '')}
              </button>
            );
          })}
        </div>
      )}

      {/* Non-choice: show answer and self-eval */}
      {!isChoice && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="text-sm font-semibold text-blue-700 mb-2">参考答案</div>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{question.answer}</div>
          </div>

          {!revealed && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleSelfEval(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium"
              >
                我做对了
              </button>
              <button
                onClick={() => handleSelfEval(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
              >
                做错了
              </button>
            </div>
          )}

          {revealed && selfEval !== null && (
            <div className={`text-center py-2 rounded-lg font-medium ${
              selfEval ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {selfEval ? '自评：做对了' : '自评：做错了'}
            </div>
          )}
        </div>
      )}

      {/* Result indicator for choice */}
      {isChoice && revealed && selected && (
        <div className={`mb-4 text-center py-2 rounded-lg font-medium ${
          selected === question.answer
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {selected === question.answer ? '回答正确！' : `回答错误，正确答案是 ${question.answer}`}
        </div>
      )}

      {/* Explanation */}
      {revealed && question.explanation && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="text-sm font-semibold text-gray-500 mb-2">解析</div>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
