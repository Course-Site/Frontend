import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTestData } from '../hooks/useTestData';

const TestPage: React.FC = () => {
  // Получаем testId из URL параметров
  const { testId } = useParams<{ testId: string }>();
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<{score: number, total: number} | null>(null);

  const { 
    test,
    questions,
    answers,
    loading,
    error
  } = useTestData(testId);

  // Определяем тип вопроса (single/multiple) по количеству правильных ответов
  const getQuestionType = (questionId: string) => {
    const correctAnswers = answers.filter(a => 
      a.testQuestionId === questionId && a.isCorrect
    );
    return correctAnswers.length > 1 ? 'multiple' : 'single';
  };

  // Обработчик выбора ответа
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setUserAnswers(prev => {
      const questionType = getQuestionType(questionId);
      const currentAnswers = prev[questionId] || [];

      if (questionType === 'single') {
        return { ...prev, [questionId]: [answerId] };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.includes(answerId)
            ? currentAnswers.filter(id => id !== answerId)
            : [...currentAnswers, answerId]
        };
      }
    });
  };

  // Проверка результатов
  const calculateResults = () => {
    let score = 0;
    let totalCorrect = 0;

    questions.forEach(question => {
      const correctAnswerIds = answers
        .filter(a => a.testQuestionId === question.id && a.isCorrect)
        .map(a => a.id);

      const userSelected = userAnswers[question.id] || [];

      // Для вопросов с одним правильным ответом
      if (correctAnswerIds.length === 1) {
        if (userSelected[0] === correctAnswerIds[0]) {
          score++;
        }
      } 
      // Для вопросов с несколькими правильными ответами
      else {
        const allCorrectSelected = correctAnswerIds.every(id => 
          userSelected.includes(id)
        );
        const noIncorrectSelected = userSelected.every(id =>
          correctAnswerIds.includes(id)
        );
        
        if (allCorrectSelected && noIncorrectSelected) {
          score++;
        }
      }

      totalCorrect += correctAnswerIds.length;
    });

    setResults({
      score,
      total: questions.length
    });
  };

  if (loading) return <div className="text-center p-4">Загрузка теста...</div>;
  if (error) return <div className="text-red-500 p-4">Ошибка: {error}</div>;
  if (!test) return <div className="p-4">Тест не найден (ID: {testId})</div>;
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
        
        {/* Вывод описания теста */}
        {test.description && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Описание теста:</h3>
            <p className="text-gray-700">{test.description}</p>
          </div>
        )}
        
        {results && (
          <div className="bg-blue-100 text-blue-800 p-4 rounded mb-4">
            Результат: {results.score} из {results.total} ({Math.round((results.score/results.total)*100)}%)
          </div>
        )}
      </div>

      <div className="space-y-8">
        {questions.map((question) => {
          const questionType = getQuestionType(question.id);
          const currentAnswers = userAnswers[question.id] || [];

          return (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Вопрос {question.number}
                </h2>
                
                {/* Вывод текста вопроса */}
                <div className="bg-gray-50 p-3 rounded mt-2">
                  <p className="text-gray-800">{question.text}</p>
                </div>
              </div>
              
              {question.imageUrl && (
                <img 
                  src={question.imageUrl} 
                  alt="Иллюстрация вопроса" 
                  className="mb-4 max-w-full h-48 object-contain border rounded"
                />
              )}

              <div className="space-y-3">
                <h3 className="font-medium">Варианты ответов:</h3>
                {answers
                  .filter(answer => answer.testQuestionId === question.id)
                  .map(answer => (
                    <div key={answer.id} className="flex items-center p-3 border rounded hover:bg-gray-50">
                      <input
                        type={questionType === 'single' ? 'radio' : 'checkbox'}
                        name={`question-${question.id}`}
                        checked={currentAnswers.includes(answer.id)}
                        onChange={() => handleAnswerSelect(question.id, answer.id)}
                        className="mr-3 h-5 w-5"
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

      <div className="mt-8 text-center">
        <button 
          onClick={calculateResults}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Проверить результаты
        </button>
      </div>
    </div>
  );
};

export default TestPage;