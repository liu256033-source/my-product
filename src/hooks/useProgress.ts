import { useState, useEffect, useCallback } from 'react';
import type { ProgressMap, ProgressEntry } from '../types';

const STORAGE_KEY = 'review-progress';

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  useEffect(() => {
    if (Object.keys(progress).length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const markAnswer = useCallback((questionId: string, correct: boolean) => {
    setProgress(prev => ({
      ...prev,
      [questionId]: { done: true, correct, timestamp: Date.now() },
    }));
  }, []);

  const resetProgress = useCallback((questionId?: string) => {
    if (questionId) {
      setProgress(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    } else {
      setProgress({});
    }
  }, []);

  const getStats = useCallback((questionIds: string[]) => {
    let done = 0;
    let correct = 0;
    for (const id of questionIds) {
      const entry = progress[id];
      if (entry?.done) {
        done++;
        if (entry.correct) correct++;
      }
    }
    return { total: questionIds.length, done, correct };
  }, [progress]);

  const getWrongIds = useCallback((questionIds: string[]) => {
    return questionIds.filter(id => progress[id]?.done && !progress[id]?.correct);
  }, [progress]);

  const isDone = useCallback((questionId: string) => {
    return !!progress[questionId]?.done;
  }, [progress]);

  const getEntry = useCallback((questionId: string): ProgressEntry | undefined => {
    return progress[questionId];
  }, [progress]);

  return { progress, markAnswer, resetProgress, getStats, getWrongIds, isDone, getEntry };
}
