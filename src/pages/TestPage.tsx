// src/pages/TestPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  imageUrl?: string;
  answers: Answer[];
}

interface Test {
  title: string;
  questions: Question[];
}

const TestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`http://localhost:4200/api/v1/test/findById/${id}`);
        const data = await res.json();
        setTest(data);
        setUserAnswers(new Array(data.questions.length).fill(-1)); // -1 = не выбран
      } catch (err) {
        console.error("Ошибка загрузки теста", err);
      }
    };

    if (id) fetchTest();
  }, [id]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!test) return;

    let correctCount = 0;

    test.questions.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index];
      if (userAnswerIndex !== -1 && question.answers[userAnswerIndex]?.isCorrect) {
        correctCount++;
      }
    });

    setResult(correctCount);
  };

  if (!test) {
    return <div className="p-4">Загрузка теста...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{test.title}</h1>

      {test.questions.map((question, qIndex) => (
        <div key={qIndex} className="border rounded p-4 space-y-2">
          <h2 className="font-semibold">{qIndex + 1}. {question.questionText}</h2>
          {question.imageUrl && (
            <img src={question.imageUrl} alt={`Вопрос ${qIndex + 1}`} className="w-64 rounded" />
          )}

          <div className="space-y-2">
            {question.answers.map((answer, aIndex) => (
              <label key={aIndex} className="block">
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  checked={userAnswers[qIndex] === aIndex}
                  onChange={() => handleAnswerSelect(qIndex, aIndex)}
                  className="mr-2"
                />
                {answer.text}
              </label>
            ))}
          </div>
        </div>
      ))}

      {result === null ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Завершить тест
        </button>
      ) : (
        <div className="text-lg font-semibold">
          Результат: {result} из {test.questions.length} правильных ответов
        </div>
      )}
    </div>
  );
};

export default TestPage;
