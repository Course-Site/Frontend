import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLectureById } from "../store/lectureSlice";
import { RootState, AppDispatch } from "../store/store";

const LecturePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { lectures, loading, error } = useSelector((state: RootState) => state.lecture);
  const lecture = lectures.find((l) => l.id === id);

  useEffect(() => {
    if (id) dispatch(fetchLectureById(id));
  }, [id, dispatch]);

  if (loading) return <p className="text-center">Загрузка лекции...</p>;
  if (error) return <p className="text-center text-red-500">Ошибка: {error}</p>;
  if (!lecture) return <p className="text-center">Лекция не найдена.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{lecture.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: lecture.content }} />
    </div>
  );
};

export default LecturePage;
