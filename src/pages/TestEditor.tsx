import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks'; // путь может отличаться
import { createFullTest } from '../store/testFullSlice'; // импорт твоего thunk
import Button from '../components/Button/Button';
//import { Answer, Question, TestEditorProps } from '../types/types';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  imageUrl: string;
  answers: Answer[];
}

interface TestEditorProps {
  isEdit: boolean;
}

const TestEditor: React.FC<TestEditorProps> = ({ isEdit }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: '',
      imageUrl: '',
      answers: [{ text: '', isCorrect: false }],
    },
  ]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const topicIdFromUrl = queryParams.get('topicId');
    if (topicIdFromUrl) {
      setTopicId(topicIdFromUrl);
    }
  }, [location.search]);

  const handleSave = async () => {
    if (!topicId || !title || !description) {
      alert('Пожалуйста, укажите тему, описнаие и название теста.');
      return;
    }
  
    // Проверка вопросов и ответов
    if (questions.some(q => !q.text.trim())) {
      alert('Все вопросы должны содержать текст.');
      return;
    }
  
    const allAnswers = questions.flatMap(q => q.answers);
    if (allAnswers.some(a => !a.text.trim())) {
      alert('Все ответы должны содержать текст.');
      return;
    }
  
    if (questions.some(q => !q.answers.some(a => a.isCorrect))) {
      alert('У каждого вопроса должен быть хотя бы один правильный ответ.');
      return;
    }
  
    // Подготовка данных для отправки
    const payload = {
      title,
      topicId,
      description,
      questions: questions.map(q => ({
        text: q.text,
        imageUrl: q.imageUrl
      })),
      answers: questions.flatMap((q, qIndex) => 
        q.answers.map(a => ({
          text: a.text,
          isCorrect: a.isCorrect,
          questionIndex: qIndex
        }))
      )
    };
  
    try {
      await dispatch(createFullTest(payload)).unwrap();
      alert('Тест успешно создан!');
    } catch (error) {
      console.error('Ошибка при создании теста:', error);
      alert(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };
  

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        imageUrl: '',
        answers: [{ text: '', isCorrect: false }],
      },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('Тест должен содержать хотя бы один вопрос.');
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleDeleteAnswer = (qIndex: number, aIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].answers.length <= 1) {
      alert('Вопрос должен содержать хотя бы один ответ.');
      return;
    }
    newQuestions[qIndex].answers.splice(aIndex, 1);
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex: number, aIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].isCorrect =
      !newQuestions[qIndex].answers[aIndex].isCorrect;
    setQuestions(newQuestions);
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{isEdit ? 'Заглушка редактирования' : 'Создать тест'}</h1>

      <div>
        <label className="block font-semibold mb-1">Название теста*</label>
        <input
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название теста"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Описание теста</label>
        <textarea
          className="border p-2 w-full rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Введите описание (необязательно)"
          rows={3}
        />
      </div>

      {topicId && (
        <div className="bg-gray-100 p-2 rounded">
          <strong>Тема:</strong> {topicId}
        </div>
      )}

      <div className="space-y-4">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-4 rounded space-y-4 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Вопрос {qIndex + 1}</h3>
              <button
                onClick={() => handleDeleteQuestion(qIndex)}
                className="text-red-600 hover:text-red-800 text-sm"
                title="Удалить вопрос"
              >
                Удалить
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-1">Текст вопроса*</label>
              <input
                className="border p-2 w-full rounded"
                value={question.text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIndex].text = e.target.value;
                  setQuestions(updated);
                }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Ссылка на изображение (необязательно)</label>
              <input
                className="border p-2 w-full rounded"
                value={question.imageUrl}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIndex].imageUrl = e.target.value;
                  setQuestions(updated);
                }}
              />
            </div>

            <div className="space-y-3">
              <label className="block font-semibold">Варианты ответов*</label>
              {question.answers.map((answer, aIndex) => (
                <div key={aIndex} className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                    className="h-5 w-5"
                  />
                  <input
                    className="border p-2 flex-1 rounded"
                    value={answer.text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].answers[aIndex].text = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                  <button
                    onClick={() => handleDeleteAnswer(qIndex, aIndex)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddAnswer(qIndex)}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                + Добавить вариант ответа
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="test-secondary" onClick={handleAddQuestion} >
          + Добавить вопрос
        </Button>

        <Button variant="test-primary" onClick={handleSave}>
          Создать тест
        </Button>
      </div>
    </div>
  );
};

export default TestEditor;
