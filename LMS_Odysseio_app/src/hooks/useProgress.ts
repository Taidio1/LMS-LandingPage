import { useState, useEffect } from 'react';

export const useProgress = () => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lms_progress');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  const toggleLesson = (lessonId: string) => {
    const newProgress = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(newProgress);
    localStorage.setItem('lms_progress', JSON.stringify(newProgress));
  };

  const isCompleted = (lessonId: string) => completedLessons.includes(lessonId);

  return { completedLessons, toggleLesson, isCompleted };
};
