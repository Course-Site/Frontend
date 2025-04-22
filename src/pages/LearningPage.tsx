import React, { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchTopics, fetchLectures, fetchLabs, fetchTests, createTopic } from "../store/learningSlice";
import { RootState, AppDispatch } from "../store/store";
import type { Lecture, Lab } from "../store/learningSlice";
import { Link } from "react-router-dom";
import Button from "../components/Button/Button";

const LearningPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, lectures, labs, tests, loading, error } = useSelector((state: RootState) => state.learning);
  const { user } = useSelector((state: RootState) => state.auth);

  const [newTopicTitle, setNewTopicTitle] = useState("Тема");

  useEffect(() => {
    dispatch(fetchTopics());
    dispatch(fetchLectures());
    dispatch(fetchLabs());
    dispatch(fetchTests());
  }, [dispatch]);

  const handleCreateTopic = () => {
    if (newTopicTitle.trim() === "") return;

    dispatch(createTopic({ title: newTopicTitle }))
      .unwrap()
      .then(() => {
        setNewTopicTitle("Тема");
      })
      .catch((err) => {
        console.error("Ошибка при создании темы:", err);
      });
  };

  const getLectureByTopic = (topicId: string): Lecture | undefined => {
    return lectures.find((l) => l.topicId === topicId);
  };

  const getLabByTopic = (topicId: string): Lab | undefined => {
    return labs.find((l) => l.topicId === topicId);
  };

  const getTestByTopic = (topicId: string) => tests.find((t) => t.topicId === topicId);

  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Обучение</h1>

      {loading && <p>Загрузка тем...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-6">
        {topics.map((topic) => {
          const lecture = getLectureByTopic(topic.id);
          const lab = getLabByTopic(topic.id);
          const test = getTestByTopic(topic.id);

          return (
            <li key={topic.id} className="border border-black p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{topic.title}</h2>
              <p className="text-gray-600">{topic.description}</p>

              <div className="mt-4 space-y-2">
                {/* Лекция */}
                <div className="flex justify-between items-center">
                  <div>
                    {lecture ? (
                      <Link to={`/lecture/${lecture.id}`} className="text-blue-600 hover:underline">
                        Лекция: {lecture.title}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Лекция не добавлена</span>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      {lecture ? (
                        <Link to={`/lecture/edit/${lecture.id}`} className="btn-admin">Изменить</Link>
                      ) : (
                        <Link to={`/lecture/create?topicId=${topic.id}`} className="btn-admin">Добавить</Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Лабораторная работа */}
                <div className="flex justify-between items-center">
                  <div>
                    {lab ? (
                      <Link to={`/lab/${lab.id}`} className="text-blue-600 hover:underline">
                        Лабораторная: {lab.title}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Лабораторная не добавлена</span>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      {lab ? (
                        <Link to={`/lab/edit/${lab.id}`} className="btn-admin">Редактировать</Link>
                      ) : (
                        <Link to={`/lab/create?topicId=${topic.id}`} className="btn-admin">Добавить</Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Тест */}
                <div className="flex justify-between items-center">
                  <div>
                    {test ? (
                      <Link to={`/test/${test.id}`} className="text-blue-600 hover:underline">
                        Тест: {test.title}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Тест не добавлен</span>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      {test ? (
                        <Link to={`/admin/edit-test/${test.id}`} className="btn-admin">Редактировать</Link>
                      ) : (
                        <Link to={`/admin/create-test?topicId=${topic.id}`} className="btn-admin">Добавить</Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}

        {isAdmin && (
          <li className="border border-black p-4 rounded shadow bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Создать новую тему</h2>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Название темы"
              className="w-full p-2 border rounded mb-4"
            />
            <Button
              variant="primary"
              className="px-3 py-2"
              onClick={handleCreateTopic}
            >
              Сохранить тему
            </Button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LearningPage;