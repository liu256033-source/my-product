import { Link, Outlet, useLocation } from 'react-router-dom';
import { TYPE_LABELS } from '../types';
import type { QuestionType } from '../types';

const TYPES: QuestionType[] = ['choice', 'calculation', 'analysis'];

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-blue-700 hover:text-blue-800 no-underline">
            计组题库
          </Link>
          {!isHome && (
            <nav className="flex gap-1">
              {TYPES.map(t => {
                const active = location.pathname.includes(`/quiz/${t}`);
                return (
                  <Link
                    key={t}
                    to={`/quiz/${t}`}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-underline
                      ${active
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {TYPE_LABELS[t]}
                  </Link>
                );
              })}
              <Link
                to="/wrong-book"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-underline
                  ${location.pathname === '/wrong-book'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                错题本
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
