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
  const { results: testResults } = useAppSelector((state) => state.testResult);
  const { results: labResults } = useAppSelector((state) => state.labResult);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTests());
      dispatch(fetchLabs());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && tests.length > 0) {
      tests.forEach((test) => {
        dispatch(getTestResultByTestAndUser({ testId: test.id, userId }));
      });
    }
  }, [dispatch, tests, userId]);

  useEffect(() => {
    if (userId && labs.length > 0) {
      labs.forEach((lab) => {
        dispatch(getLabResultByLabAndUser({ labId: lab.id, userId }));
      });
    }
  }, [dispatch, labs, userId]);

  const getTestScore = (testId: string) => {
    const result = Array.isArray(testResults)
      ? testResults.find((r) => r.testId === testId && r.userId === userId)
      : testResults?.testId === testId
      ? testResults
      : null;

    return result?.score ?? 0;
  };

  const getLabScore = (labId: string) => {
    const result = labResults.find((r) => r.labId === labId && r.userId === userId);
    return result?.score ?? 0;
  };

  const totalTestScore = tests.reduce((sum, test) => sum + getTestScore(test.id), 0);
  const totalLabScore = labs.reduce((sum, lab) => sum + getLabScore(lab.id), 0);

  const totalScore = totalTestScore + totalLabScore;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Ваша статистика</h2>

      <div className="mb-6 text-lg">
        <p>
          <span className="font-medium">Общее количество баллов:</span>{" "}
          <span className="font-bold">{totalScore}</span>
        </p>
        <p>
          <span className="font-medium">Баллы за тесты:</span>{" "}
          {totalTestScore}
        </p>
        <p>
          <span className="font-medium">Баллы за лабораторные:</span>{" "}
          {totalLabScore}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Тесты</h3>
          <ul className="space-y-2">
            {tests.map((test) => (
              <li key={test.id} className="flex justify-between border-b pb-1">
                <span>{test.title}</span>
                <span className="font-bold">{getTestScore(test.id)}</span>
              </li>
            ))}
          </ul>
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
