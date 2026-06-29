import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Question, QuestionType } from '../types';
import { TYPE_LABELS } from '../types';
import { useProgress } from '../hooks/useProgress';

interface HomePageProps {
  questions: Question[];
}

export default function HomePage({ questions }: HomePageProps) {
  const { getStats, getWrongIds } = useProgress();

  const typeStats = useMemo(() => {
    const types: QuestionType[] = ['choice', 'calculation', 'analysis'];
    return types.map(type => {
      const ids = questions.filter(q => q.type === type).map(q => q.id);
      return { type, label: TYPE_LABELS[type], stats: getStats(ids), ids };
    });
  }, [questions, getStats]);

  const allIds = useMemo(() => questions.map(q => q.id), [questions]);
  const overall = useMemo(() => getStats(allIds), [allIds, getStats]);
  const wrongCount = useMemo(() => getWrongIds(allIds).length, [allIds, getWrongIds]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">计算机组成原理</h1>
      <p className="text-center text-gray-500 mb-8">复习题库</p>

      {/* Overall progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">学习进度</h2>
          <span className="text-sm text-gray-500">
            已完成 {overall.done}/{overall.total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>正确率 {overall.done > 0 ? Math.round((overall.correct / overall.done) * 100) : 0}%</span>
          {wrongCount > 0 && (
            <Link to="/wrong-book" className="text-red-600 hover:text-red-700 no-underline font-medium">
              错题 {wrongCount} 道 →
            </Link>
          )}
        </div>
      </div>

      {/* Type cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {typeStats.map(({ type, label, stats }) => (
          <Link
            key={type}
            to={`/quiz/${type}`}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all no-underline group"
          >
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 mb-3">
              {label}
            </h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.total}
              <span className="text-sm font-normal text-gray-400 ml-1">题</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-2">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {stats.done > 0
                ? `已完成 ${stats.done} 题 · 正确率 ${Math.round((stats.correct / stats.done) * 100)}%`
                : '未开始'}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/quiz/choice?mode=random"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors no-underline font-medium"
        >
          随机刷选择题
        </Link>
        {wrongCount > 0 && (
          <Link
            to="/wrong-book"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors no-underline font-medium"
          >
            复习错题 ({wrongCount})
          </Link>
        )}
      </div>
    </div>
  );
}
