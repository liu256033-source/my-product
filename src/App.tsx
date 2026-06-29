import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import WrongBook from './pages/WrongBook';
import type { Question } from './types';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('./questions.json')
      .then(res => {
        if (!res.ok) throw new Error('加载题库失败');
        return res.json();
      })
      .then(data => {
        setQuestions(data as Question[]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">加载题库中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage questions={questions} />} />
        <Route path="/quiz/:type" element={<QuizPage questions={questions} />} />
        <Route path="/wrong-book" element={<WrongBook questions={questions} />} />
      </Route>
    </Routes>
  );
}
