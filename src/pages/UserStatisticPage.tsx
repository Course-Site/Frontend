import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTests } from "../store/testSlice";
import { fetchLabs } from "../store/labSlice";
import { getTestResultByTestAndUser } from "../store/testResultSlice";
import { getLabReportByLabAndUser } from "../store/labReportSlice";
import { getLabResultByLabAndUser } from "../store/labResultSlice";

const UserStatisticPage: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  // Получаем данные из хранилища
  const { tests, loading: testsLoading, error: testsError } = useAppSelector((state) => state.test);
  const { labs, loading: labsLoading, error: labsError } = useAppSelector((state) => state.lab);
  const { reports: labReports, loading: reportsLoading, error: reportsError } = useAppSelector((state) => state.labReport);
  const { results: labResults, loading: resultsLoading, error: labResultsError } = useAppSelector((state) => state.labResult);
  const { testResultByTestAndUser, loading: testResultsLoading, error: testResultsError } = 
    useAppSelector((state) => state.testResult);

  console.log('Current labReports:', labReports); // Лог текущих отчетов
  console.log('Current labResults:', labResults); // Лог текущих результатов
  
  // Состояния для ручного ввода оценок
  const [labScores, setLabScores] = useState<Record<string, number>>({});

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    console.log('Fetching tests and labs...'); // Лог начала загрузки
    dispatch(fetchTests());
    dispatch(fetchLabs());
  }, [dispatch, userId]);

  // Загружаем результаты тестов для каждого теста
  useEffect(() => {
    if (tests.length > 0 && userId) {
      console.log('Fetching test results for tests:', tests.map(t => t.id)); // Лог тестов
      tests.forEach(test => {
        dispatch(getTestResultByTestAndUser({ testId: test.id, userId }));
      });
    }
  }, [dispatch, tests, userId]);

  useEffect(() => {
  if (!userId || labs.length === 0) return;

  const fetchLabData = async () => {
    try {
      const reportPromises = labs.map(async (lab) => {
        try {
          const reportResult = await dispatch(getLabReportByLabAndUser({ labId: lab.id, userId })).unwrap();
          console.log(`Fetched report for lab ${lab.id}`, reportResult);
        } catch (err) {
          console.error(`Error fetching report for lab ${lab.id}:`, err);
        }

        try {
          const result = await dispatch(getLabResultByLabAndUser({ labId: lab.id, userId })).unwrap();
          console.log(`Fetched result for lab ${lab.id}`, result);
        } catch (err) {
          console.error(`Error fetching result for lab ${lab.id}:`, err);
        }
      });

      await Promise.all(reportPromises);
    } catch (err) {
      console.error('Unexpected error fetching lab data:', err);
    }
  };

  fetchLabData();
}, [dispatch, labs, userId]);


  // Остальные функции без изменений
  const handleLabScoreChange = (labId: string, score: number) => {
    setLabScores(prev => ({ ...prev, [labId]: score }));
  };

  const getTestResult = (testId: string) => {
    if (!testResultByTestAndUser) return null;
    return Array.isArray(testResultByTestAndUser) 
      ? testResultByTestAndUser.find(result => result.testId === testId)
      : testResultByTestAndUser.testId === testId 
        ? testResultByTestAndUser 
        : null;
  };

  const getLabReport = (labId: string) => {
    const reports = labReports.filter(report => report.labId === labId && report.userId === userId);
    console.log(`Reports for lab ${labId}:`, reports); // Лог отчетов для конкретной лабораторной
    return reports[0]; // Возвращаем первый отчет (или undefined)
  };

  const getLabResult = (labId: string) => {
    return labResults.find(result => result.labId === labId && result.userId === userId);
  };

  const getTotalTestsScore = () => {
    if (!tests.length || !testResultByTestAndUser) return 0;
    return tests.reduce((sum, test) => {
      const result = getTestResult(test.id);
      return sum + (result?.score || 0);
    }, 0);
  };

  const getTotalLabsScore = () => {
    return labResults.reduce((sum, result) => sum + (result?.score || 0), 0) + 
           Object.values(labScores).reduce((sum, score) => sum + (score || 0), 0);
  };

  const getTotalScore = () => {
    return getTotalTestsScore() + getTotalLabsScore();
  };

  if (testsLoading || labsLoading || reportsLoading || resultsLoading || testResultsLoading) {
    return <div className="text-center p-4">Загрузка данных...</div>;
  }

  if (testsError || labsError || reportsError || labResultsError || testResultsError) {
    return <div className="text-red-500 p-4 text-center">
      {testsError || labsError || reportsError || labResultsError || testResultsError}
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
            {labs.map(lab => {
              const report = getLabReport(lab.id);
              const result = getLabResult(lab.id);
              const fileUrl = report?.filepath 
                ? `http://localhost:4200/${report.filepath.replace(/\\/g, '/')}`
                : null;

              console.log(`Rendering lab ${lab.id} with report:`, report); // Лог перед рендерингом

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
                        {report?.filename || 'Скачать работу'}
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
                      value={result?.score || labScores[lab.id] || ''}
                      onChange={(e) => handleLabScoreChange(lab.id, +e.target.value)}
                    />
                    <span className="text-gray-500 ml-2">/100</span>
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