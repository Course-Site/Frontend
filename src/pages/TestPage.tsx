import React, { useState } from 'react';
import { useTestData } from '../hooks/useTestData';

const TestPage: React.FC = () => {
  const testId = "9745d555-8181-4554-b525-76169eac91cb";
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  
  const { 
    test,
    questions,
    answers,
    loading,
    error,
    topicId
  } = useTestData(testId);

  const handleSelectQuestion = async (questionId: string) => {
    setSelectedQuestionId(questionId);
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!test) return <div>Тест не найден</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Заголовок теста */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{test.title}</h1>
        <p className="text-gray-600">Тема: {topicId}</p>
      </div>

      {/* Список вопросов и ответов */}
      <div className="flex gap-4">
        <div className="w-1/4">
          <h2 className="font-semibold mb-4">Вопросы</h2>
          <ul className="space-y-2">
            {questions.map(q => (
              <li key={q.id}>
                <button
                  onClick={() => handleSelectQuestion(q.id)}
                  className={`w-full text-left p-2 rounded ${
                    selectedQuestionId === q.id ? 'bg-blue-100' : ''
                  }`}
                >
                  Вопрос {q.number}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          {selectedQuestion && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {selectedQuestion.questionText}
              </h2>
              <div className="space-y-2">
                {answers.filter(a => a.testQuestionId === selectedQuestionId).map(answer => (
                  <div key={answer.id} className="flex items-center p-2 border rounded">
                    <input 
                      type="checkbox" 
                      checked={answer.isCorrect} 
                      readOnly 
                      className="mr-2"
                    />
                    {answer.text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;