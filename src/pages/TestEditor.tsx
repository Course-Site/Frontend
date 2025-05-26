import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { createFullTest } from '../store/testFullSlice';
import Button from '../components/Button/Button';

interface Answer {
  text: string;
  isCorrect: boolean;
  score: number; // Добавляем поле для веса ответа
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
  console.log("topicId: ", topicId);
  const [description, setDescription] = useState('');
  const [maxScore, setMaxScore] = useState(100); // Максимальный балл за тест
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: '',
      imageUrl: '',
      answers: [{ text: '', isCorrect: false, score: 0 }],
    },
  ]);

  // Автоматически рассчитываем баллы за ответы при изменении вопросов или maxScore
  useEffect(() => {
    if (questions.length > 0) {
      const scorePerQuestion = maxScore / questions.length;
      const updatedQuestions = questions.map(question => ({
        ...question,
        answers: question.answers.map(answer => ({
          ...answer,
          score: answer.isCorrect ? scorePerQuestion / question.answers.filter(a => a.isCorrect).length : 0
        }))
      }));
      setQuestions(updatedQuestions);
    }
  }, [maxScore, questions, questions.length]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const topicIdFromUrl = queryParams.get('topicId');
    if (topicIdFromUrl) {
      setTopicId(topicIdFromUrl);
    }
  }, [location.search]);

  const handleSave = async () => {
    // Валидация основных полей
    if (!topicId || !title || !description) {
      console.log("topicId: ", topicId);
      alert('Пожалуйста, укажите тему, описание и название теста.');
      return;
    }

    // Проверка вопросов
    if (questions.some(q => !q.text.trim())) {
      alert('Все вопросы должны содержать текст.');
      return;
    }

    // Проверка ответов
    const allAnswers = questions.flatMap(q => q.answers);
    if (allAnswers.some(a => !a.text.trim())) {
      alert('Все ответы должны содержать текст.');
      return;
    }

    // Проверка наличия правильных ответов
    if (questions.some(q => !q.answers.some(a => a.isCorrect))) {
      alert('У каждого вопроса должен быть хотя бы один правильный ответ.');
      return;
    }

    // Валидация суммы баллов
    const totalScore = questions.reduce((sum, q) => 
      sum + q.answers.reduce((aSum, a) => aSum + a.score, 0), 0);
    
    if (Math.abs(totalScore - maxScore) > 0.01) { // Учитываем возможные ошибки округления
      alert(`Сумма баллов за все ответы (${totalScore}) должна равняться максимальному баллу (${maxScore})`);
      return;
    }

    // Подготовка данных для отправки
    const payload = {
      title,
      topicId,
      description,
      maxScore, // Добавляем maxScore в payload
      questions: questions.map(q => ({
        text: q.text,
        imageUrl: q.imageUrl
      })),
      answers: questions.flatMap((q, qIndex) => 
        q.answers.map(a => ({
          text: a.text,
          isCorrect: a.isCorrect,
          score: a.score, // Добавляем score в ответы
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
    const scorePerQuestion = maxScore / (questions.length + 1);
    const updatedQuestions = questions.map(q => ({
      ...q,
      answers: q.answers.map(a => ({
        ...a,
        score: a.isCorrect ? scorePerQuestion / q.answers.filter(a => a.isCorrect).length : 0
      }))
    }));

    setQuestions([
      ...updatedQuestions,
      {
        text: '',
        imageUrl: '',
        answers: [{ text: '', isCorrect: false, score: 0 }],
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
    newQuestions[qIndex].answers.push({ 
      text: '', 
      isCorrect: false, 
      score: 0 
    });
    setQuestions(newQuestions);
  };

  const handleDeleteAnswer = (qIndex: number, aIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].answers.length <= 1) {
      alert('Вопрос должен содержать хотя бы один ответ.');
      return;
    }
    newQuestions[qIndex].answers.splice(aIndex, 1);
    
    // Пересчет баллов после удаления ответа
    const question = newQuestions[qIndex];
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    if (correctAnswers.length > 0) {
      const scorePerCorrectAnswer = (maxScore / questions.length) / correctAnswers.length;
      newQuestions[qIndex].answers = question.answers.map(a => ({
        ...a,
        score: a.isCorrect ? scorePerCorrectAnswer : 0
      }));
    }
    
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex: number, aIndex: number) => {
    const newQuestions = [...questions];
    const question = newQuestions[qIndex];
    const answer = question.answers[aIndex];
    
    answer.isCorrect = !answer.isCorrect;
    
    // Пересчет баллов при изменении правильности ответа
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    if (correctAnswers.length > 0) {
      const scorePerCorrectAnswer = (maxScore / questions.length) / correctAnswers.length;
      question.answers = question.answers.map(a => ({
        ...a,
        score: a.isCorrect ? scorePerCorrectAnswer : 0
      }));
    } else {
      question.answers = question.answers.map(a => ({
        ...a,
        score: 0
      }));
    }
    
    setQuestions(newQuestions);
  };

  const handleAnswerScoreChange = (qIndex: number, aIndex: number, value: string) => {
    const newQuestions = [...questions];
    const score = parseFloat(value) || 0;
    newQuestions[qIndex].answers[aIndex].score = score;
    setQuestions(newQuestions);
  };

  // Подсчет общего количества баллов
  const totalScore = useMemo(() => {
    return questions.reduce((sum, q) => 
      sum + q.answers.reduce((aSum, a) => aSum + a.score, 0), 0);
  }, [questions]);

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{isEdit ? 'Редактирование теста' : 'Создать тест'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block font-semibold mb-1">Максимальный балл*</label>
          <input
            type="number"
            min="1"
            step="1"
            className="border p-2 w-full rounded"
            value={maxScore}
            onChange={(e) => setMaxScore(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
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
                <div key={aIndex} className="flex gap-3 items-start">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                      className="h-5 w-5"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="border p-2 w-20 rounded"
                      value={answer.score.toFixed(1)}
                      onChange={(e) => handleAnswerScoreChange(qIndex, aIndex, e.target.value)}
                      disabled={!answer.isCorrect}
                    />
                  </div>
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

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Статистика теста</h3>
        <p>Всего вопросов: {questions.length}</p>
        <p>Максимальный балл: {maxScore}</p>
        <p className={`font-bold ${Math.abs(totalScore - maxScore) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
          Текущая сумма баллов: {totalScore.toFixed(2)} / {maxScore}
        </p>
        {Math.abs(totalScore - maxScore) > 0.01 && (
          <p className="text-red-600">Сумма баллов не соответствует максимальному баллу!</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="test-secondary" onClick={handleAddQuestion}>
          + Добавить вопрос
        </Button>

        <Button 
          variant="test-primary" 
          onClick={handleSave}
          disabled={Math.abs(totalScore - maxScore) > 0.01}
        >
          {isEdit ? 'Сохранить изменения' : 'Создать тест'}
        </Button>
      </div>
    </div>
  );
};

export default TestEditor;