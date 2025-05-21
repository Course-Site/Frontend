import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTestById } from '../store/testSlice';
import { fetchTestQuestions } from "../store/testQuestionSlice";
import { fetchAllTestAnswers } from "../store/testAnswerSlice";
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

  // Get data from each slice separately
  const { tests, loading: testLoading, error: testError } = useAppSelector((state) => state.test);
  const { questions: allQuestions, loading: questionsLoading, error: questionsError } = useAppSelector((state) => state.testQuestion);
  const { answers: allAnswers, loading: answersLoading, error: answersError } = useAppSelector((state) => state.testAnswer);

  // Combine loading states
  const loading = testLoading || questionsLoading || answersLoading;
  // Combine errors (returns first error encountered)
  const error = testError || questionsError || answersError;

  // Load all necessary data
  useEffect(() => {
    if (testId) {
      dispatch(fetchTestById(testId));
      dispatch(fetchTestQuestions());
      dispatch(fetchAllTestAnswers());
    }
  }, [dispatch, testId]);

  // Memoized computed data
  const data = useMemo(() => {
    const currentTest = testId ? tests.find(t => t.id === testId) || null : null;
    const topicId = currentTest?.topicId || '';
    
    const testQuestions = allQuestions
      .filter(q => q.testId === testId)
      .sort((a, b) => Number(a.number ?? 0) - Number(b.number ?? 0));
    
    // Get all question IDs for the test
    const questionIds = testQuestions.map(q => q.id);
    
    // Filter answers by test questions
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