import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getStatisticsByUserId, deleteUserStatistic } from "../store/testStatistic";
import { UserTestStatistic } from "../types/types";

const UserStatisticPage: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  // Исправленный селектор - проверяем наличие свойства в store
  const statistics = useAppSelector((state) => 
    state.userTestStatistics?.statistics || []
  ) as UserTestStatistic[];

  const [labMarks, setLabMarks] = useState<Record<string, number>>({});

  useEffect(() => {
    if (userId) {
      dispatch(getStatisticsByUserId(userId));
    }
  }, [userId, dispatch]);

  const handleSetMark = (labId: string, mark: number) => {
    setLabMarks((prev) => ({ ...prev, [labId]: mark }));
  };

  const handleDeleteStatistic = (statId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту статистику?")) {
      dispatch(deleteUserStatistic(statId));
    }
  };

  const getTotalScore = () => {
    const testScore = statistics.reduce((sum, stat) => sum + (stat.score || 0), 0);
    const labScore = Object.values(labMarks).reduce((sum, m) => sum + m, 0);
    return testScore + labScore;
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Статистика пользователя ID: {userId}</h1>

      <div className="mb-6 text-xl font-semibold">
        Общее количество баллов: {getTotalScore()}
      </div>

      {statistics.length === 0 ? (
        <div className="text-gray-500">Нет данных статистики</div>
      ) : (
        <div className="space-y-6">
          {statistics.map((stat) => (
            <div key={stat.id} className="border p-4 rounded-lg shadow-sm">
              <div className="text-lg font-semibold">
                Тест: {stat.test?.title || "Без названия"}
              </div>
              <div>Баллы за тест: {stat.score}</div>

              <div className="mt-4">
                <div className="text-md font-medium mb-2">Лабораторная:</div>
                {stat.labReport?.fileUrl ? (
                  <div className="flex items-center gap-3">
                    <a
                      href={stat.labReport.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Скачать работу
                    </a>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="w-20 border rounded px-2 py-1"
                        placeholder="Оценка"
                        value={labMarks[stat.labReport.labId] || ""}
                        onChange={(e) =>
                          handleSetMark(stat.labReport.labId, +e.target.value)
                        }
                      />
                      <span className="text-gray-500">/100</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">Нет загруженной работы</div>
                )}
              </div>

              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDeleteStatistic(stat.id)}
              >
                Удалить статистику
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStatisticPage;