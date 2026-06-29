interface ModeSelectorProps {
  mode: 'sequential' | 'random';
  onChange: (mode: 'sequential' | 'random') => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      <button
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
          ${mode === 'sequential' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
        onClick={() => onChange('sequential')}
      >
        顺序
      </button>
      <button
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
          ${mode === 'random' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
        onClick={() => onChange('random')}
      >
        随机
      </button>
    </div>
  );
}
