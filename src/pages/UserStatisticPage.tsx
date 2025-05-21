import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTests } from "../store/testSlice";
import { fetchLabs } from "../store/labSlice";
import { getTestResultByTestAndUser } from "../store/testResultSlice";

const UserStatisticPage: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  // Получаем данные из хранилища
  const { tests, loading: testsLoading, error: testsError } = useAppSelector((state) => state.test);
  const { labs, loading: labsLoading, error: labsError } = useAppSelector((state) => state.lab);
  const { testResultByTestAndUser, loading: resultsLoading, error: resultsError } = 
    useAppSelector((state) => state.testResult);
  
  // Состояния для лабораторных работ
  const [labScores, setLabScores] = useState<Record<string, number>>({});
  const [labFiles, setLabFiles] = useState<Record<string, string>>({});

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchTests());
    dispatch(fetchLabs());
  }, [dispatch, userId]);

  // Загружаем результаты тестов для каждого теста
  useEffect(() => {
    if (tests.length > 0 && userId) {
      tests.forEach(test => {
        dispatch(getTestResultByTestAndUser({ testId: test.id, userId }));
      });
    }
  }, [dispatch, tests, userId]);

  // Обработчик изменения оценки лабораторной работы
  const handleLabScoreChange = (labId: string, score: number) => {
    setLabScores(prev => ({ ...prev, [labId]: score }));
  };

  // Получаем результат теста по ID теста
  const getTestResult = (testId: string) => {
    if (!testResultByTestAndUser) return null;
    return Array.isArray(testResultByTestAndUser) 
      ? testResultByTestAndUser.find(result => result.testId === testId)
      : testResultByTestAndUser.testId === testId 
        ? testResultByTestAndUser 
        : null;
  };

  // Вычисление общих баллов
  const getTotalTestsScore = () => {
    if (!tests.length || !testResultByTestAndUser) return 0;
    return tests.reduce((sum, test) => {
      const result = getTestResult(test.id);
      return sum + (result?.score || 0);
    }, 0);
  };

  const getTotalLabsScore = () => {
    return Object.values(labScores).reduce((sum, score) => sum + (score || 0), 0);
  };

  const getTotalScore = () => {
    return getTotalTestsScore() + getTotalLabsScore();
  };

  if (testsLoading || labsLoading || resultsLoading) {
    return <div className="text-center p-4">Загрузка данных...</div>;
  }

  if (testsError || labsError || resultsError) {
    return <div className="text-red-500 p-4 text-center">
      {testsError || labsError || resultsError}
    </div>;
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Статистика пользователя ID: {userId}</h1>

      {/* Общая статистика */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Общая статистика</h2>
        <div className="text-lg">
          Общее количество баллов: <span className="font-bold">{getTotalScore()}</span>
        </div>
      </div>

      {/* Раздел тестов */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Тесты</h2>
        
        {tests.length === 0 ? (
          <div className="text-gray-500">Нет доступных тестов</div>
        ) : (
          <div className="space-y-4">
            {tests.map(test => {
              const result = getTestResult(test.id);
              return (
                <div key={test.id} className="border-b pb-4">
                  <div className="font-medium">{test.title}</div>
                  <div className="mt-2">
                    <span className="mr-2">Баллы:</span>
                    <span className="font-bold">
                      {result?.score ?? 'Не пройден'}
                    </span>
                    <span className="text-gray-500 ml-2">/100</span>
                  </div>
                  {result?.createdAt && (
                    <div className="text-sm text-gray-500 mt-1">
                      Пройден: {new Date(result.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className="pt-4 border-t font-medium">
              Всего за тесты: {getTotalTestsScore()} баллов
            </div>
          </div>
        )}
      </div>

      {/* Раздел лабораторных работ */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Лабораторные работы</h2>
        
        {labs.length === 0 ? (
          <div className="text-gray-500">Нет доступных лабораторных работ</div>
        ) : (
          <div className="space-y-4">
            {labs.map(lab => (
              <div key={lab.id} className="border-b pb-4">
                <div className="font-medium">{lab.title}</div>
                
                <div className="mt-2">
                  <div className="mb-2">Загруженная работа:</div>
                  {labFiles[lab.id] ? (
                    <a 
                      href={labFiles[lab.id]} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Скачать работу
                    </a>
                  ) : (
                    <div className="text-gray-500">Работа не загружена</div>
                  )}
                </div>
                
                <div className="flex items-center mt-2">
                  <span className="mr-2">Оценка:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-20 border rounded px-2 py-1"
                    value={labScores[lab.id] || ''}
                    onChange={(e) => handleLabScoreChange(lab.id, +e.target.value)}
                  />
                  <span className="text-gray-500 ml-2">/100</span>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t font-medium">
              Всего за лабораторные работы: {getTotalLabsScore()} баллов
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatisticPage;