import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTestById,
  fetchTestQuestions,
  fetchAllTestAnswers
} from '../store/testSlice';
import { Answer, Question, Test } from '../types/types';

interface UseTestDataReturn {
  test: Test | null;
  questions: Question[];
  answers: Answer[];
  loading: boolean;
  error: string | null;
  topicId: string;
}

export const useTestData = (testId?: string): UseTestDataReturn => {
  const dispatch = useAppDispatch();
  const {
    tests,
    questions: allQuestions,
    answers: allAnswers,
    loading,
    error
  } = useAppSelector((state) => state.test);

  // Загрузка всех необходимых данных
  useEffect(() => {
    if (testId) {
      dispatch(fetchTestById(testId));
      dispatch(fetchTestQuestions());
      dispatch(fetchAllTestAnswers());
    }
  }, [dispatch, testId]);

  // Мемоизированные вычисляемые данные
  const data = useMemo(() => {
    const currentTest = testId ? tests.find(t => t.id === testId) || null : null;
    const topicId = currentTest?.topicId || '';
    
    const testQuestions = allQuestions
    .filter(q => q.testId === testId)
    .sort((a, b) => Number(a.number ?? 0) - Number(b.number ?? 0));
    
    // Получаем все ID вопросов теста
    const questionIds = testQuestions.map(q => q.id);
    
    // Фильтруем ответы по вопросам теста
    const testAnswers = allAnswers.filter(a => 
      questionIds.includes(a.questionId)
    );

    return {
      test: currentTest,
      questions: testQuestions,
      answers: testAnswers,
      topicId
    };
  }, [testId, tests, allQuestions, allAnswers]);

  return {
    test: data.test,
    questions: data.questions,
    answers: data.answers,
    loading,
    error,
    topicId: data.topicId
  };
};
