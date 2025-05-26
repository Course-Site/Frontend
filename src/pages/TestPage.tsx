import React, { useState} from 'react';
import { useParams } from 'react-router-dom';
import { useTestData } from '../hooks/useTestData';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { submitTestAnswers } from '../store/testResultSlice';

const TestPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [submissionState, setSubmissionState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [testResult, setTestResult] = useState<{
    score: number;
    totalQuestions: number;
  } | null>(null);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(
    (state) => state.test
  );

  const {
    test,
    questions,
    answers,
    loading: testLoading,
    error: testError,
  } = useTestData(testId);

  const getQuestionType = (questionId: string) => {
    const correctAnswers = answers.filter(
      (a) => a.questionId === questionId && a.isCorrect
    );
    return correctAnswers.length > 1 ? 'multiple' : 'single';
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    if (submissionState === 'success') return;

    setUserAnswers((prev) => {
      const questionType = getQuestionType(questionId);
      const currentAnswers = prev[questionId] || [];

      if (questionType === 'single') {
        return { ...prev, [questionId]: [answerId] };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.includes(answerId)
            ? currentAnswers.filter((id) => id !== answerId)
            : [...currentAnswers, answerId],
        };
      }
    });
  };

const handleSubmitAnswers = async () => {
  if (!testId || !questions.length) return;

  setSubmissionState('loading');

  try {
    const result = await dispatch(
      submitTestAnswers({
        testId,
        answers: Object.entries(userAnswers).map(([questionId, answerIds]) => ({
          questionId,
          selectedAnswerIds: answerIds,
        })),
      })
    ).unwrap();

    if (typeof result?.totalScore === 'number') {
      setTestResult({
        score: result.totalScore,
        totalQuestions: questions.length,
      });
      console.log(result.score);
      setSubmissionState('success');
    } else {
      console.log(result.score);
      console.log("result.totalScore: ", result.totalScore);
      console.error('Не получен score в ответе:', result);
      setSubmissionState('error');
    }
  } catch (error) {
    console.error('Ошибка при отправке ответов:', error);
    setSubmissionState('error');
  }
};


  const allQuestionsAnswered =
    questions.length > 0 &&
    questions.every((q) => userAnswers[q.id]?.length > 0);

  if (testLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Загрузка теста...</p>
        </div>
      </div>
    );
  }

  if (testError) {
    return <div className="text-red-500 p-4 text-center">{testError}</div>;
  }

  if (!test) {
    return <div className="p-4 text-center">Тест не найден (ID: {testId})</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{test.title}</h1>

        {test.description && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Описание теста:</h3>
            <p className="text-gray-700">{test.description}</p>
          </div>
        )}

        {testResult && (
          <div
            className={`p-4 rounded mb-4 ${
              testResult.score / testResult.totalQuestions >= 0.7
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <p className="font-semibold">
              Ваш результат: {testResult.score} из {testResult.totalQuestions} (
              {Math.round((testResult.score / testResult.totalQuestions) * 100)}%)
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((question) => {
          const questionType = getQuestionType(question.id);
          const currentAnswers = userAnswers[question.id] || [];

          return (
            <div
              key={question.id}
              className="bg-white p-4 md:p-6 rounded-lg shadow"
            >
              <div className="mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  Вопрос {question.number}
                </h2>
                <div className="bg-gray-50 p-3 rounded mt-2">
                  <p className="text-gray-800">{question.text}</p>
                </div>
              </div>

              {question.imageUrl && (
                <img
                  src={question.imageUrl}
                  alt="Иллюстрация вопроса"
                  className="mb-4 max-w-full h-auto max-h-64 object-contain border rounded"
                />
              )}

              <div className="space-y-2">
                <h3 className="font-medium">Варианты ответов:</h3>
                {answers
                  .filter((answer) => answer.questionId === question.id)
                  .map((answer) => (
                    <div
                      key={answer.id}
                      className={`flex items-center p-3 border rounded transition-colors ${
                        currentAnswers.includes(answer.id)
                          ? 'bg-amber-50 border-amber-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type={questionType === 'single' ? 'radio' : 'checkbox'}
                        name={`question-${question.id}`}
                        checked={currentAnswers.includes(answer.id)}
                        onChange={() => handleAnswerSelect(question.id, answer.id)}
                        className="mr-3 h-5 w-5"
                        disabled={submissionState === 'success'}
                      />
                      <label className="cursor-pointer w-full">
                        {answer.text}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {submissionState !== 'success' && (
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmitAnswers}
            disabled={!allQuestionsAnswered || loading}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              allQuestionsAnswered
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Отправка...
              </span>
            ) : (
              'Отправить ответы'
            )}
          </button>

          {!allQuestionsAnswered && questions.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Ответьте на все вопросы для отправки
            </p>
          )}
        </div>
      )}

      {submissionState === 'success' && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
          Тест успешно завершен!
        </div>
      )}
    </div>
  );
};

export default TestPage;