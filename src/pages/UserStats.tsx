import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTests } from "../store/testSlice";
import { fetchLabs } from "../store/labSlice";
import { getTestResultByTestAndUser } from "../store/testResultSlice";
import { getLabResultByLabAndUser } from "../store/labResultSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const UserStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  const { tests } = useAppSelector((state) => state.test);
  const { labs } = useAppSelector((state) => state.lab);
  const { results: labResults } = useAppSelector((state) => state.labResult);
  const { testResultsByTestAndUser } = useAppSelector((state) => state.testResult);

  // Очистка результатов при смене пользователя
  useEffect(() => {
    dispatch({ type: "testResult/resetTestResultsByUser" });
  }, [userId, dispatch]);

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
        if (!testResultsByTestAndUser[test.id]) {
          dispatch(getTestResultByTestAndUser({ testId: test.id, userId }));
        }
      });
    }
  }, [dispatch, tests, userId, testResultsByTestAndUser]);

  // Загрузка результатов лабораторных
  useEffect(() => {
    if (userId && labs.length > 0) {
      labs.forEach((lab) => {
        dispatch(getLabResultByLabAndUser({ labId: lab.id, userId }));
      });
    }
  }, [dispatch, labs, userId]);

  const getTestResult = (testId: string) => {
    const resultList = testResultsByTestAndUser[testId];
    if (Array.isArray(resultList)) return resultList[0] || null;
    return resultList || null;
  };

  const getTestScore = (testId: string) => {
    const result = getTestResult(testId);
    // Учитываем поле totalScore или score
    return result?.totalScore ?? result?.score ?? 0;
  };

  const getLabScore = (labId: string) => {
    const result = labResults.find((r) => r.labId === labId && r.userId === userId);
    return result?.score ?? 0;
  };

  const totalTestScore = tests.reduce((sum, test) => sum + getTestScore(test.id), 0);
  const totalLabScore = labs.reduce((sum, lab) => sum + getLabScore(lab.id), 0);
  const totalScore = totalTestScore + totalLabScore;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mb-10">
      <h2 className="text-2xl font-bold mb-4">Ваша статистика</h2>

      <div className="mb-6 text-lg">
        <p>
          <span className="font-medium">Общее количество баллов:</span>{" "}
          <span className="font-bold">{totalScore}</span>
        </p>
        <p>
          <span className="font-medium">Баллы за тесты:</span> {totalTestScore}
        </p>
        <p>
          <span className="font-medium">Баллы за лабораторные:</span> {totalLabScore}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {result ? getTestScore(test.id) : "Не пройден"}
                      </span>
                    </div>
                    {result?.completedAt && (
                      <div className="text-sm text-gray-500 mt-1">
                        Пройден: {new Date(result.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Лабораторные работы</h3>
          <ul className="space-y-2">
            {labs.map((lab) => (
              <li key={lab.id} className="flex justify-between border-b pb-1">
                <span>{lab.title}</span>
                <span className="font-bold">{getLabScore(lab.id)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
