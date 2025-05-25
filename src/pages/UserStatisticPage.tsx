import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTests } from "../store/testSlice";
import { fetchLabs } from "../store/labSlice";
import { getTestResultByTestAndUser } from "../store/testResultSlice";
import { getLabReportByLabAndUser } from "../store/labReportSlice";
import {
  getLabResultByLabAndUser,
  createLabResult,
  updateLabResult,
} from "../store/labResultSlice";

const UserStatisticPage: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Получаем данные из хранилища
  const { tests, loading: testsLoading, error: testsError } = useAppSelector(
    (state) => state.test
  );
  const { labs, loading: labsLoading, error: labsError } = useAppSelector(
    (state) => state.lab
  );
  const { reports: labReports, loading: reportsLoading, error: reportsError } =
    useAppSelector((state) => state.labReport);
  const {
    results: labResults,
    loading: resultsLoading,
    error: labResultsError,
  } = useAppSelector((state) => state.labResult);
  const {
    testResultByTestAndUser,
    loading: testResultsLoading,
    error: testResultsError,
  } = useAppSelector((state) => state.testResult);

  // Локальное состояние для редактируемых оценок
  const [editableScores, setEditableScores] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  // Загрузка данных при монтировании
  useEffect(() => {
    if (userId) {
      dispatch(fetchTests());
      dispatch(fetchLabs());
    }
  }, [dispatch, userId]);

  // Загрузка результатов тестов
  useEffect(() => {
    if (tests.length > 0 && userId) {
      tests.forEach((test) => {
        dispatch(getTestResultByTestAndUser({ testId: test.id, userId }));
      });
    }
  }, [dispatch, tests, userId]);

  // Загрузка отчетов и результатов лабораторных работ
  useEffect(() => {
    if (labs.length > 0 && userId) {
      labs.forEach((lab) => {
        dispatch(getLabReportByLabAndUser({ labId: lab.id, userId }));
        dispatch(getLabResultByLabAndUser({ labId: lab.id, userId }));
      });
    }
  }, [dispatch, labs, userId]);

  // Инициализация редактируемых оценок при получении результатов
  useEffect(() => {
    const initialScores: Record<string, number> = {};
    labResults.forEach(result => {
      if (result.userId === userId) {
        initialScores[result.labId] = result.score;
      }
    });
    setEditableScores(initialScores);
  }, [labResults, userId]);

  // Обработчик изменения оценки
  const handleScoreChange = (labId: string, value: string) => {
    const score = parseInt(value) || 0;
    setEditableScores(prev => ({
      ...prev,
      [labId]: Math.min(Math.max(score, 0), 100) // Ограничение от 0 до 100
    }));
  };

  // Сохранение оценки
  const saveLabScore = async (labId: string) => {
    if (!userId) return;

    const score = editableScores[labId];
    if (score === undefined) return;

    setIsSaving(prev => ({ ...prev, [labId]: true }));

    try {
      const existingResult = labResults.find(
        r => r.labId === labId && r.userId === userId
      );

      if (existingResult) {
        await dispatch(updateLabResult({
          id: existingResult.id,
          score
        })).unwrap();
      } else {
        await dispatch(createLabResult({
          labId,
          userId,
          score
        })).unwrap();
      }
    } catch (error) {
      console.error("Ошибка сохранения оценки:", error);
      // Можно добавить уведомление об ошибке
    } finally {
      setIsSaving(prev => ({ ...prev, [labId]: false }));
    }
  };

  // Получение результата теста
  const getTestResult = (testId: string) => {
    if (!testResultByTestAndUser) return null;
    
    return Array.isArray(testResultByTestAndUser)
      ? testResultByTestAndUser.find((r) => r.testId === testId)
      : testResultByTestAndUser.testId === testId
      ? testResultByTestAndUser
      : null;
  };

  // Получение отчета по лабораторной работе
  const getLabReport = (labId: string) => {
    return labReports.find((r) => r.labId === labId && r.userId === userId);
  };

  // Получение результата лабораторной работы
  const getLabResult = (labId: string) => {
    return labResults.find((r) => r.labId === labId && r.userId === userId);
  };

  // Подсчет общего балла за тесты
  const getTotalTestsScore = () => {
    return tests.reduce((sum, test) => {
      const result = getTestResult(test.id);
      return sum + (result?.score || 0);
    }, 0);
  };

  // Подсчет общего балла за лабораторные работы
  const getTotalLabsScore = () => {
    return labs.reduce((sum, lab) => {
      const result = getLabResult(lab.id);
      const score = result?.score ?? 0;
      return sum + score;
    }, 0);
  };

  // Состояние загрузки
  const isLoading = 
    testsLoading || 
    labsLoading || 
    reportsLoading || 
    resultsLoading || 
    testResultsLoading;

  // Обработка ошибок
  const error = 
    testsError || 
    labsError || 
    reportsError || 
    labResultsError || 
    testResultsError;

  if (isLoading) {
    return <div className="text-center p-4">Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">
        Статистика пользователя ID: {userId}
      </h1>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Общая статистика</h2>
        <div className="text-lg">
          Общее количество баллов:{" "}
          <span className="font-bold">
            {getTotalTestsScore() + getTotalLabsScore()}
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Тесты</h2>
        {tests.length === 0 ? (
          <div className="text-gray-500">Нет доступных тестов</div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const result = getTestResult(test.id);
              return (
                <div key={test.id} className="border-b pb-4">
                  <div className="font-medium">{test.title}</div>
                  <div className="mt-2">
                    <span className="mr-2">Баллы:</span>
                    <span className="font-bold">
                      {result?.score ?? "Не пройден"}
                    </span>
                    <span className="text-gray-500 ml-2">/100</span>
                  </div>
                  {result?.createdAt && (
                    <div className="text-sm text-gray-500 mt-1">
                      Пройден:{" "}
                      {new Date(result.createdAt).toLocaleDateString()}
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

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Лабораторные работы</h2>
        {labs.length === 0 ? (
          <div className="text-gray-500">Нет доступных лабораторных работ</div>
        ) : (
          <div className="space-y-4">
            {labs.map((lab) => {
              const report = getLabReport(lab.id);
              const result = getLabResult(lab.id);
              const fileUrl = report?.filepath
                ? `http://localhost:4200/${report.filepath.replace(/\\/g, "/")}`
                : null;
              const currentScore = editableScores[lab.id] ?? result?.score ?? 0;
              const isLabSaving = isSaving[lab.id] || false;

              return (
                <div key={lab.id} className="border-b pb-4">
                  <div className="font-medium">{lab.title}</div>

                  <div className="mt-2">
                    <div className="mb-2">Загруженная работа:</div>
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        download={report?.filename}
                      >
                        {report?.filename || "Скачать работу"}
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
                      className="w-20 border rounded px-2 py-1 mr-2"
                      value={currentScore}
                      onChange={(e) => handleScoreChange(lab.id, e.target.value)}
                      disabled={isLabSaving}
                    />
                    <span className="text-gray-500 mr-2">/100</span>
                    <button
                      onClick={() => saveLabScore(lab.id)}
                      disabled={isLabSaving}
                      className={`px-3 py-1 rounded text-white ${
                        isLabSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isLabSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    {isLabSaving && (
                      <span className="ml-2 text-gray-500">Сохранение...</span>
                    )}
                  </div>
                </div>
              );
            })}

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