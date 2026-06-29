interface ProgressBarProps {
  done: number;
  total: number;
  correct: number;
}

export default function ProgressBar({ done, total, correct }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const correctPct = done > 0 ? Math.round((correct / done) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>进度 {done}/{total} ({pct}%)</span>
        <span>正确率 {correctPct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
